"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  const handleSignIn = async () => {
    return await authClient.signIn.social({
      provider: "google",
    });
  };
  return (
    <main className="sign-in">
      <aside className="testimonial">
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo.svg"}
            alt="logo"
            width={32}
            height={32}
          ></Image>
          <h1>SnapCast</h1>
        </Link>
        <div className="description">
          <section>
            <figure>
              {Array.from({ length: 5 }).map((_, index) => (
                <Image
                  key={index}
                  src={"/assets/icons/star.svg"}
                  alt="stars"
                  width={20}
                  height={20}
                ></Image>
              ))}
            </figure>
            <p>
              SnapCast makes screen recording easy.From quick walkthroughs to
              full presentations ,it's fast,smooth and shareable in seconds
            </p>
            <article>
              <Image
                className="rounded-full"
                src={"/assets/images/jason.png"}
                alt="jason"
                height={100}
                width={120}
              ></Image>
              <div>
                <h2>Jason Riveria</h2>
                <p>Product Designer at Atlassian</p>
              </div>
            </article>
          </section>
        </div>
        <p> © SnapCast {new Date().getFullYear()}</p>
      </aside>
      <aside className="google-sign-in">
        <section>
          <Link href={"/"}>
            <Image
              src={"/assets/icons/logo.svg"}
              alt="logo"
              width={40}
              height={40}
            />
            <h1>SnapCast</h1>
          </Link>
          <p>
            Create and share your first <span>SNAPCAST</span> video in no time
          </p>
          <button onClick={handleSignIn}>
            <Image
              src={"/assets/icons/google.svg"}
              alt="google"
              width={32}
              height={32}
            ></Image>
            Sign-in With Google
          </button>
        </section>
      </aside>
      <div className="overlay" />
    </main>
  );
};

export default page;
