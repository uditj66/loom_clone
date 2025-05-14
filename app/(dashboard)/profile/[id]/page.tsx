import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import React from "react";

const page = async ({ params }: ParamsWithSearch) => {
  const { id } = await params;
  return (
    <div className="wrapper page">
      <Header
        title="udit | loom"
        subHeader="uditj66"
        userImg="/assets/images/dummy.jpg"
      />
      <section className="video-grid">
        {dummyCards.map((card) => (
          <VideoCard {...card} key={card.id} />
        ))}
      </section>
    </div>
  );
};

export default page;
