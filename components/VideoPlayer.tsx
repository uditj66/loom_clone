import { videos } from "@/drizzle/schema";
import { createIframeLink } from "@/lib/utils";
import React from "react";

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  return (
    <div className="video-player">
      <iframe
        src={createIframeLink(videoId)}
        loading="lazy"
        title="videoPlayer"
        style={{ border: 0, zIndex: 50 }}
        allowFullScreen
        allow="acclerometer;gyroscope:autoplay;encrypted-media;picture-in-picutre"
      />
    </div>
  );
};

export default VideoPlayer;
