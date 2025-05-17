import VideoDetailHeader from "@/components/VideoDetailHeader";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideoById } from "@/lib/actions/video";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: Params) => {
  const { id } = await params;

  const { user, video } = await getVideoById(id);
  if (!video) redirect("/404");

  return (
    <div className="wrapper page">

      <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId}/>
      {/* <h1 className="text-2xl"> {video.title}</h1>
      <h1 className="text-2xl"> {video.videoId}</h1> */}
      <section className="video-details">
        <div className="content">

      <VideoPlayer videoId={video.videoId} />
        </div>

      </section>
    </div>
  );
};

export default page;
