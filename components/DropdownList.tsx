"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

const DropdownList = ({
  options,
  selectedOption,
  onOptionSelect,
  triggerElement,
}: DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionClick = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };
  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {triggerElement}
      </div>
      {isOpen && (
        <ul className="dropdown">
          {options.map((option) => (
            <li
              key={option}
              className={cn("list-item", {
                "bg-pink-100 text-white": selectedOption === option,
              })}
              onClick={() => handleOptionClick(option)}
            >
              {option}
              {selectedOption === option && (
                <Image
                  src={"assets/icons/check.svg"}
                  alt="checkmark"
                  width={20}
                  height={20}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownList;
