import { ICONS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DropdownList from "./DropdownList";
import RecordScreen from "./RecordScreen";

const Header = ({ subHeader, title, userImg }: SharedHeaderProps) => {
  return (
    <header className="header">
      <section className="header-container">
        <div className="details">
          {userImg && (
            <Image
              className="rounded-full"
              src={userImg || "/assets/images/dummy.jpg"}
              alt="user"
              width={66}
              height={66}
            ></Image>
          )}
          <article>
            <p>{subHeader}</p>
            <h1>{title}</h1>
          </article>
        </div>

        <aside>
          <Link href={"/upload"}>
            <Image
              src={ICONS.upload}
              alt="upload"
              width={16}
              height={16}
            ></Image>
            <span>Upload a Video</span>
          </Link>
          {/* later replaced with RecordScreen component */}
          {/* <div className="record">
            <button className="primary-btn">
              <Image
                src={ICONS.record}
                alt="record"
                width={16}
                height={16}
              ></Image>
              <span>Record a Video</span>
            </button>
          </div> */}

          <RecordScreen />
        </aside>
      </section>

      <section className="search-filter">
        <div className="search">
          <input
            type="text"
            placeholder="search for videos , tags , folders..."
          />
          <Image
            src={"/assets/icons/search.svg"}
            alt="search"
            width={16}
            height={16}
          ></Image>
        </div>
        <DropdownList />
      </section>
    </header>
  );
};

export default Header;
