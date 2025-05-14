"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
const user = {};
const Navbar = () => {
  const router = useRouter();
  return (
    <header className="navbar">
      <nav>
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo.svg"}
            alt="logo"
            height={32}
            width={32}
          ></Image>
          <h1>SnapCast</h1>
        </Link>
        {user && (
          <figure>
            <button onClick={() => router.push("/profile/123456")}>
              <Image
                className="rounded-full "
                src={"/assets/images/dummy.jpg"}
                alt="user"
                width={36}
                height={36}
              ></Image>
            </button>

            <button className="cursor-pointer">
              <Image
                className="rotate-180"
                src={"/assets/icons/logout.svg"}
                alt="logout"
                width={32}
                height={32}
              ></Image>
            </button>
          </figure>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
