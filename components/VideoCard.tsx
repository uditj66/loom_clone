"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const VideoCard = ({
  id,
  title,
  createdAt,
  thumbnail,
  username,
  userImg,
  visibility,
  views,
  duration,
}: VideoCardProps) => {
  return (
    <Link href={`/video/${id}`} className="video-card">
      <Image
        className="thumbnail"
        src={thumbnail}
        alt="thumbnail"
        width={290}
        height={160}
      ></Image>

      <article>
        <div>
          <figure>
            <Image
              src={userImg}
              alt="avatar"
              width={34}
              height={34}
              className="rounded-full aspect-square"
            ></Image>
            <figcaption>
              <h3>{username}</h3>
              <p>{visibility}</p>
            </figcaption>
          </figure>
          <aside>
            <Image
              src={"/assets/icons/eye.svg"}
              alt="views"
              height={16}
              width={16}
            ></Image>
            <span>{views}</span>
          </aside>
        </div>
        <h2>
          {title}-{" "}
          {createdAt.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </h2>
      </article>
      <button className="copy-btn">
        <Image
          src={"/assets/icons/link.svg"}
          alt="copy "
          width={18}
          height={18}
        />
      </button>
      {duration && (
        <div className="duration">{Math.ceil(duration / 60)}min</div>
      )}
    </Link>
  );
};

export default VideoCard;
