"use client";
import Image from "next/image";
import React, { useState } from "react";

const DropdownList = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-trigger">
          <figure>
            <Image
              src={"/assets/icons/hamburger.svg"}
              alt="list"
              width={14}
              height={14}
            ></Image>
            Most Recent
          </figure>
          <Image
            src={"/assets/icons/arrow-down.svg"}
            width={20}
            height={20}
            alt="arrow-down"
          />
        </div>
      </div>
      {isOpen && (
        <ul className="dropdown">
          {["MOST RECENT", "MOSTLIKED"].map((option) => (
            <li className="list-item" key={option}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownList;
