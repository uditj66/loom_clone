"use client";
import { filterOptions, ICONS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DropdownList from "./DropdownList";
import RecordScreen from "./RecordScreen";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateURLParams } from "@/lib/utils";
import ImageWithFallback from "./ImageWithFallBack";
import { useDebounceValue } from "usehooks-ts";
const Header = ({ subHeader, title, userImg }: SharedHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [selectedFilter, setSelectedFilter] = useState(
    searchParams.get("filter") || "Choose Filter"
  );

  const [debouncedValue, setDebouncedValue] = useDebounceValue(
    searchQuery,
    500
  );

  useEffect(() => {
    if (debouncedValue !== searchParams.get("query")) {
      const url = updateURLParams(
        searchParams,
        { query: debouncedValue },
        pathname
      );
      router.push(url);
    }
  }, [debouncedValue]);
  const handleFilterChange = (filter: string) => {
    if (filter.includes("No Filter")) {
      setSelectedFilter(filter);
      router.push(pathname);
      return;
    }
    setSelectedFilter(filter);
    const url = updateURLParams(searchParams, { filter: filter }, pathname);
    router.push(url);
  };
  const renderFilterTrigger = () => (
    <div className="filter-trigger">
      <figure>
        <Image
          src={"/assets/icons/hamburger.svg"}
          alt="list"
          width={14}
          height={14}
        />
        {selectedFilter}
      </figure>
      <Image
        src={"/assets/icons/arrow-down.svg"}
        width={20}
        height={20}
        alt="arrow-down"
      />
    </div>
  );

  return (
    <header className="header">
      <section className="header-container">
        <figure className="details">
          {/* Handling broken Image URLs if we provide fallback directly in source then it won't work bcz we render Image tag conditionally i.e if the userImg exists then,but what if the userImg is undefined or null  */}
          {userImg && (
            <ImageWithFallback
              className="rounded-full"
              src={userImg}
              alt="user"
              width={66}
              height={66}
            />
          )}
          <article>
            <p>{subHeader}</p>
            <h1>{title}</h1>
          </article>
        </figure>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Image
            src={"/assets/icons/search.svg"}
            alt="search"
            width={16}
            height={16}
          />
        </div>
        <DropdownList
          options={filterOptions}
          selectedOption={selectedFilter}
          onOptionSelect={handleFilterChange}
          triggerElement={renderFilterTrigger()}
        />
      </section>
    </header>
  );
};

export default Header;
