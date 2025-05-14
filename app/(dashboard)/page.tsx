import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <main className="wrapper page">
      <Header title="ALL VIDEOS" subHeader="Public Library" />
      <h1 className="text-2xl font-karla">Welcome to LOOM clone</h1>
     <section className="video-grid">
     {dummyCards.map((card) => (
        <VideoCard {...card} key={card.id} />
      ))}
      <VideoCard
        id="1"
        title="SnapchatMessage"
        createdAt={new Date(Date.now())}
        thumbnail="/assets/samples/thumbnail (1).png"
        username="jason"
        userImg="/assets/images/jason.png"
        views={10}
        visibility="public"
        duration={156}
      />
     </section>
    </main>
  );
};

export default Page;
