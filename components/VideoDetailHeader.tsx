"use client";
import { daysAgo } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ImageWithFallback from "./ImageWithFallBack";
import { authClient } from "@/lib/auth-client";
import DropdownList from "./DropdownList";
import { visibilities } from "@/constants";
import { deleteVideo, updateVideoVisibility } from "@/lib/actions/video";
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
  const { data } = authClient.useSession();
  const userId = data?.user?.id;
  const isOwner = userId === ownerId;
  const [copied, setCopied] = useState(false);
  const [isdeleting, setIsDeleting] = useState(false);
  const [isupdating, setIsUpdating] = useState(false);
  const [visibilityState, setVisibilityState] =
    useState<Visibility>(visibility);

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
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVideo(videoId, thumbnailUrl);
      console.log("deleted");
      router.push("/");
    } catch (error) {
      console.error("Error While deleting", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleVisibilityChange = async (option: string) => {
    if (option !== visibilityState) {
      setIsUpdating(true);
      try {
        await updateVideoVisibility(videoId, option);
        setVisibilityState(option);
      } catch (error) {
        console.error("Error Updating the visibility", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };
  const triggerList = () => (
    <div className="visibility-trigger">
      <div>
        <Image
          className="mt-0.5"
          src="/assets/icons/eye.svg"
          alt="views"
          height={16}
          width={16}
        />
        <p>{visibilityState}</p>
      </div>
      <Image
        src="/assets/icons/arrow-down.svg"
        alt="arrow-down"
        height={16}
        width={16}
      />
    </div>
  );
  return (
    <header className="detail-header">
      <aside className="user-info">
        <h1>{title}</h1>
        <figure>
          <button onClick={() => router.push(`/profile/${ownerId}`)}>
            <ImageWithFallback
              src={userImg ?? ""}
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

        {isOwner && (
          <div className="user-btn">
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={isdeleting}
            >
              {isdeleting ? "Deleting ...." : "Delete Video"}
            </button>
            <div className="bar" />
            {isupdating ? (
              <div className="update-stats">
                <p>Updating ...</p>
              </div>
            ) : (
              <DropdownList
                options={visibilities}
                selectedOption={visibilityState}
                onOptionSelect={handleVisibilityChange}
                triggerElement={triggerList()}
              />
            )}
          </div>
        )}
      </aside>
    </header>
  );
};

export default VideoDetailHeader;
