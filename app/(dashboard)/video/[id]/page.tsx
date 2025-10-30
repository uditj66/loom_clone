import VideoDetailHeader from "@/components/VideoDetailHeader";
import VideoInfo from "@/components/VideoInfo";
import VideoPlayer from "@/components/VideoPlayer";
import { getTranscript, getVideoById } from "@/lib/actions/video";
import { redirect } from "next/navigation";
const page = async ({ params }: Params) => {
  const { id } = await params;
  const result = await getVideoById(id);
  if (!result || !result.video) {
    redirect("/404"); // or handle error
  }
  const { user, video } = result;
  const transcript = await getTranscript(id);
  return (
    <div className="wrapper page">
      <VideoDetailHeader
        {...video}
        userImg={user?.image}
        username={user?.name}
        ownerId={video?.userId}
      />
      {/* <h1 className="text-2xl"> {video.title}</h1>
      <h1 className="text-2xl"> {video.videoId}</h1> */}
      <section className="video-details">
        <div className="content">
          <VideoPlayer videoId={video.videoId} />
        </div>

        <VideoInfo
          title={video.title}
          description={video.description}
          createdAt={video.createdAt}
          transcript={transcript}
          videoId={video.videoId}
          videoUrl={video.videoUrl}
          key={video.id}
        />
      </section>
    </div>
  );
};

export default page;
