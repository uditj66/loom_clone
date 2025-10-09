"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  // Due to Hydration error If I use dateStyle property in SSR then HYDRATION ERROR occurs, So to tackle it I have to render date only after client mount if i want to use the datestyle property
  const [formattedDate, setFormattedDate] = useState<string>("");
  useEffect(() => {
    const date = createdAt.toLocaleDateString("en-in", {
      dateStyle: "full",
    });
    setFormattedDate(date);
  });
  return (
    <Link href={`/video/${id}`} className="video-card">
      <Image
        className="thumbnail"
        src={thumbnail}
        alt="thumbnail"
        width={290}
        height={160}
      />

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
          {title} |{" "}
          {createdAt.toLocaleDateString("en-IN", {
            // dateStyle: "full", can't be used in SSR ,bcz hydration error occurs
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
          {/* | {formattedDate} */}
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
