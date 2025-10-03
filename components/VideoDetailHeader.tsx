"use client";
import { daysAgo } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const VideoDetailHeader = ({
  title,
  createdAt,
  userImg,
  username,
  id,
  videoId,
  ownerId,
  visibility,
  thumbnailUrl,
}: VideoDetailHeaderProps) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
    setCopied(true);
  };
  useEffect(() => {
    if (!copied) return;
    const changeCheckIcon = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);
    return () => clearTimeout(changeCheckIcon);
  }, [copied]);

  return (
    <header className="detail-header">
      <aside className="user-info">
        <h1>{title}</h1>
        <figure>
          <button onClick={() => router.push(`/profile/${ownerId}`)}>
            <Image
              src={userImg || "/assets/images/dummy.jpg"}
              alt="userImage"
              width={24}
              height={24}
              className="rounded-full"
            />

            <h2>{username ?? "Guest"}</h2>
          </button>
          <figcaption>
            <span className="mt-1">|</span>
            <p>{daysAgo(createdAt)}</p>
          </figcaption>
        </figure>
      </aside>

      <aside className="cta">
        <button onClick={handleCopyLink}>
          <Image
            src={
              copied ? "/assets/images/checked.png" : "/assets/icons/link.svg"
            }
            alt="copy-link"
            width={24}
            height={24}
          />
        </button>
      </aside>
    </header>
  );
};

export default VideoDetailHeader;
