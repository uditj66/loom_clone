import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import { getAllVideosFromDb } from "@/lib/actions/video";
import React from "react";

const Page = async ({ searchParams }: SearchParams) => {
  const { query, filter, page } = await searchParams;
  const { videos, pagination } = await getAllVideosFromDb(
    query,
    filter,
    Number(page)
  );
  return (
    <main className="wrapper page">
      <Header title="ALL VIDEOS" subHeader="Public Library" />
      <h1 className="text-2xl font-karla">Welcome to LOOM clone</h1>
      {/* videos is an array of objects and each object contain two keys which are video itself and the user who created it that's why we directly de-structure these properties from videos array */}
      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video, user }) => (
            <VideoCard
              key={video.id}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user?.image || ""}
              username={user?.name || "GUEST"}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No videos Found"
          description="Try adjusting your Search "
        />
      )}
      {/* <VideoCard
        id="1"
        title="SnapchatMessage"
        createdAt={new Date(2025,8,18,22,18,26)}
        thumbnail="/assets/samples/thumbnail (1).png"
        username="jason"
        userImg="/assets/images/jason.png"
        views={10}
        visibility="public"
        duration={156}
      /> */}
    </main>
  );
};

export default Page;
