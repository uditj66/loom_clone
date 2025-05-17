"use client";
import { ICONS } from "@/constants";
import { useScreenRecording } from "@/lib/hooks/useScreenRecording";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const RecordScreen = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    startRecording,
    stopRecording,
    resetRecording,
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
  } = useScreenRecording();
  const closeModal = () => {
    resetRecording();
    setIsOpen(false);
  };

  const handleStart = async () => {
    await startRecording();
  };

  const recordAgain = async () => {
    resetRecording();
    await startRecording();
    if (recordedVideoUrl && videoRef.current) {
      videoRef.current.src = recordedVideoUrl;
    }
  };

  const goToUpload = () => {
    if (!recordedBlob) return;
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);

      // storing the video in browser session
      sessionStorage.setItem(
        "recordedVideo",
        JSON.stringify({
          url,
          name: "screen-recording.webm",
          type: recordedBlob.type,
          size: recordedBlob.size,
          duration: recordingDuration || 0,
        })
      );
    }

    router.push("/upload");
  };
  return (
    <div className="record">
      <button className="primary-btn" onClick={() => setIsOpen(true)}>
        <Image src={ICONS.record} alt="record" width={16} height={16}></Image>
        <span>Record a Video</span>
      </button>
      {isOpen && (
        <section className="dialog">
          <div className="overlay-record" onClick={closeModal} />
          <div className="dialog-content">
            <figure>
              <h3>Screen Recording</h3>
              <button>
                <Image
                  onClick={closeModal}
                  src={ICONS.close}
                  alt="close"
                  width={20}
                  height={20}
                />
              </button>
            </figure>
            <section>
              {isRecording ? (
                <article>
                  <div />
                  <span>Recording in Progress</span>
                </article>
              ) : recordedVideoUrl ? (
                <video controls ref={videoRef} src={recordedVideoUrl} />
              ) : (
                <p>click record to start screen recording</p>
              )}
            </section>

            <div className="record-box">
              {!isRecording && !recordedVideoUrl && (
                <button onClick={handleStart} className="record-start">
                  {" "}
                  <Image
                    src={ICONS.record}
                    alt="record"
                    width={20}
                    height={20}
                  />
                  Record
                </button>
              )}

              {isRecording && (
                <button onClick={handleStart} className="record-start">
                  {" "}
                  <Image
                    src={ICONS.record}
                    alt="record"
                    width={20}
                    height={20}
                  />
                  Stop Recording
                </button>
              )}

              {recordedVideoUrl && (
                <>
                  <button className="record-again">Record again</button>
                  <button className="record-upload" onClick={goToUpload}>
                    Continue to Upload
                    <Image
                      src={ICONS.upload}
                      alt="upload"
                      height={16}
                      width={16}
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecordScreen;
