// "use client";
import Image from "next/image";
import Link from "next/link";
// import React, { useEffect, useState } from "react";

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
  /* To Stop Server-Side Pre-rendering and want to use datestyle property without getting hydration error I have to use use-client directive and then ,I have to use useEffect and useState to make it purely client component to prevents any hydration errors.

  const [formattedDate, setFormattedDate] = useState<string>("");
  useEffect(() => {
    const date = createdAt.toLocaleDateString("en-in", {
      dateStyle: "full",
    });
    setFormattedDate(date);
  });
  */
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
            dateStyle: "full", //Currently this Component is purely a server-side so no hydration error occurs and code works fine and date format is according to server format.But if i make it client-side Component using"use-client" directive and then use the datestyle property.Then i will face the hydration error and i will need to prevent the sever-side pre-rendering a feature exclusive to client-side Component.When the Component doesn't need any interactivity like click or event-listners ,or is not dependent on browser for any feature, server-sode pre-rendering occurs.To prevent server side pre-rendering i will make this component a purely clinet side by using useState or useEffect-hook as these are client-side utilities.
            // year: "numeric",
            // month: "long",
            // day: "numeric",
            // hour: "numeric",
            // minute: "numeric",
            // second: "numeric",
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
