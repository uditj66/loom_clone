"use server";
import { headers } from "next/headers";
import { auth } from "../auth";
import {
  apiFetch,
  doesTitleMatch,
  getEnv,
  withErrorHandling,
  getOrderByClause,
} from "../utils";
import { BUNNY, visibilities } from "@/constants";
import { db } from "@/drizzle/db";
import { user, videos } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import aj from "../arcjet";
import { fixedWindow, request } from "@arcjet/next";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;
const BUNNY_LIBRARY_ID = process.env.BUNNY_VIDEO_LIBRARY_ID;
const ACCESS_KEY = {
  streamAccessKey: getEnv("BUNNY_STREAM_ACCESS_KEY"),
  storageAccessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY"),
};

// Helper functions
export const getUserSessionId = async (): Promise<string> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("UNAUTHENTICATED");
  return session.user.id;
};
/*
  Why we use it:

1. In frameworks like Next.js, revalidatePath is used to re-generate or update the cached static pages for specific routes.

2. If you have incremental static regeneration (ISR) enabled, your pages can be updated without redeploying the whole site.

3. This function is just a helper to revalidate multiple paths at once, instead of calling revalidatePath separately for each path.

*/
const revalidatePaths = (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path, "page"));
};

// This is helper function that just build a Query so that if we want to use this query again then we don't need to write again .We directly use this query object and await it ,to really make an Db call.
// This query object just join (user) table with (videos) table using LEFT JOIN and selects all column from videos table and id,name,image from user table.Main table is (videos) and (videos) table left joins with (user) table.
const buildVideoWithUserQuery = () => {
  return db
    .select({
      video: videos,
      user: { id: user.id, name: user.name, image: user.image },
    })
    .from(videos)
    .leftJoin(user, eq(videos.userId, user.id));
};

// Arcjet Rate limiting function -> Using as Server Actions which can be passed as prop to client components
const validateWithArcjet = async (userId: string) => {
  // aj.withRule returns an Augmented ArcjetNext client
  const rateLimit = aj.withRule(
    fixedWindow({
      mode: "LIVE",
      window: "5m",
      max: 1,
      characteristics: ["userId"],
    })
  );

  const req = await request();
  const decision = await rateLimit.protect(req, { userId });

  if (decision.isDenied() && decision.reason.isRateLimit()) {
    throw new Error("Rate Limit Exceeded");
  }
};

// Server Actions (Related to Bunny ) which can be passed as prop to client components

// creating an videoObjectUrl so that we can upload a video to Bunny Stream Services
export const getVideoUploadUrl = withErrorHandling(async () => {
  await getUserSessionId();
  const videoResponse = await apiFetch<BunnyVideoResponse>(
    `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: "POST",
      bunnyType: "stream",
      body: {
        title: "Temporary title",
        collectionId: "",
      },
    }
  );

  const uploadUrl = `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;
  console.log(uploadUrl, videoResponse.guid);

  return {
    videoId: videoResponse.guid,
    uploadUrl,
    accessKey: ACCESS_KEY.streamAccessKey,
  };
});

// Creating an thumbnailObjectUrl so that we can upload a thumbnail to Bunny storage Services and serve via CDN
export const getThumbnailUploadUrl = withErrorHandling(
  async (videoId: string) => {
    const fileName = `${Date.now()}-${videoId}-thumbnail`;
    const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${fileName}`;
    const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${fileName}`;
    console.log();

    return {
      uploadUrl,
      cdnUrl,
      accessKey: ACCESS_KEY.storageAccessKey,
    };
  }
);

//Only updating the video title and description using the same videoObject and then create a DB entry
export const saveVideoDetails = withErrorHandling(
  async (videoDetails: VideoDetails) => {
    const userId = await getUserSessionId();
    // applying rate limiting to video Upload
    await validateWithArcjet(userId);

    // Updating the temporary Video title and temporary Video description in Bunny cdn by attaching the  actual title and description given at the time of video upload form
    await apiFetch(
      `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,
      {
        method: "POST",
        bunnyType: "stream",
        body: {
          title: videoDetails.title,
          description: videoDetails.description,
        },
      }
    );

    // saving Meta-data in database
    await db.insert(videos).values({
      ...videoDetails,
      videoUrl: `${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidatePaths(["/"]);
    return {
      videoId: videoDetails.videoId,
    };
  }
);
export const getAllVideosFromDb = withErrorHandling(
  async (
    searchQuery: string = "",
    sortFilter?: string,
    pageNumber: number = 1 /* Page number we are on ,initially */,
    pageSize: number = 8 /* no .of videos on 1 page */
  ) => {
    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user.id;
    const userSeeVideoCondition = or(
      eq(videos.visibility, "public"),
      eq(videos.userId, currentUserId!)
    );
    const whereCondition = searchQuery.trim()
      ? and(userSeeVideoCondition, doesTitleMatch(videos, searchQuery))
      : userSeeVideoCondition;
    // directly destructuring the property of the object which is the first element of the array
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(videos)
      .where(whereCondition);

    const totalVideos = Number(totalCount || 0);
    const totalPages = Math.ceil(totalVideos / pageSize);
    // Db call makes by SELECT query always return a array of objects even it returns a single row but same is not with INSERT,UPDATE ,DELETE

    // Here videoRecords is an array of objects and each object is video data with various property, as we know SELECT query returns an array of object.
    const videoRecords = await buildVideoWithUserQuery()
      .where(whereCondition)
      /* 1.You are writing the SQL manually inside a tagged template literal i.e sql`${videos.createdAt}DESC`
         2.Works fine, but you have to handle spacing, casing, and SQL syntax yourself (DESC needs no space issues).
         */
      .orderBy(
        sortFilter ? getOrderByClause(sortFilter) : sql`${videos.createdAt}DESC`
      )
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);
    return {
      videos: videoRecords,
      pagination: {
        currentPage: pageNumber,
        totalPages,
      },
    };
  }
);
export const getVideoById = withErrorHandling(async (videoId: string) => {
  // Destructuring the array first element so here videoRecord is a single video not an array
  const [videoRecord] = await buildVideoWithUserQuery().where(
    eq(videos.id, videoId)
  );

  return videoRecord;
});
export const getAllVideosByUser = withErrorHandling(
  async (
    userIdParameter: string,
    searchQuery: string = "",
    sortFilter?: string
  ) => {
    const currentUserId = (
      await auth.api.getSession({ headers: await headers() })
    )?.user.id;
    const isOwner = userIdParameter === currentUserId;

    const [userInfo] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, userIdParameter));
    if (!userInfo) throw new Error("User not found");

    const conditions = [
      eq(videos.userId, userIdParameter),
      !isOwner && eq(videos.visibility, "public"),
      searchQuery.trim() && ilike(videos.title, `%${searchQuery}%`),
    ].filter(Boolean) as any[];

    /* .filter() is a Javascript method used on arrays so it filter-out the elements from the array where we have truthy values only */
    const userVideos = await buildVideoWithUserQuery()
      .where(and(...conditions))
      /* 
       desc(videos.createdAt) → helper function provided by your ORM (probably Drizzle).

       You don’t write raw SQL; the ORM generates the correct SQL for you.

       Safer and cleaner:
 
       1.Automatically handles spacing

       2.Automatically prevents SQL injection

       3.Easier to read and maintain
      
      */
      .orderBy(
        sortFilter ? getOrderByClause(sortFilter) : desc(videos.createdAt)
      );

    return { user: userInfo, videos: userVideos, count: userVideos.length };
  }
);

export const deleteVideo = withErrorHandling(
  async (videoId: string, thumbnailUrl: string) => {
    await apiFetch(
      `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoId}`,

      {
        method: "DELETE",
        bunnyType: "stream",
      }
    );
    const thumbnailPath = thumbnailUrl.split("thumbnails/")[1];
    await apiFetch(
      `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${thumbnailPath}`,
      { method: "DELETE", bunnyType: "storage", expectJson: false }
    );

    await db.delete(videos).where(eq(videos.videoId, videoId));
    revalidatePaths(["/", `/video/${videos.id}`, `/profile/${videos.userId}`]);
    return;
  }
);

export const updateVideoVisibility = withErrorHandling(
  async (videoId: string, visibility: Visibility) => {
    await db
      .update(videos)
      .set({ visibility: visibility, updatedAt: new Date() })
      .where(eq(videos.videoId, videoId));

    revalidatePaths(["/", `/videos/${videoId}`, `/profile/${videos.userId}`]);
  }
);
export const getTranscript = withErrorHandling(async (videoId: string) => {
  const response = await fetch(
    `${BUNNY.TRANSCRIPT_URL}/${videoId}/captions/en-auto.vtt`
  );
  return response.text();
});

export const incrementVideoViews = withErrorHandling(
  async (videoId: string) => {
    await db
      .update(videos)
      .set({ views: sql`${videos.views} + 1`, updatedAt: new Date() })
      .where(eq(videos.videoId, videoId));

    revalidatePaths([`/video/${videoId}`]);
    return {};
  }
);
export const getVideoProcessingStatus = withErrorHandling(
  async (videoId: string) => {
    const processingInfo = await apiFetch<BunnyVideoResponse>(
      `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
      { bunnyType: "stream" }
    );

    return {
      isProcessed: processingInfo.status === 4,
      encodingProgress: processingInfo.encodeProgress || 0,
      status: processingInfo.status,
    };
  }
);

