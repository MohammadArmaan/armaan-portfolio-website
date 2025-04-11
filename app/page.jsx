"use client";

import Social from "@/components/Social";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import Photo from "@/components/Photo";
import Stats from "@/components/Stats";
import { useEffect, useState } from "react";

export default function Home() {
  const textArray = [
    "Software Developer",
    "Freelance Coder",
    "Tech Enthusiast",
];
const [text, setText] = useState("");
const [isDeleting, setIsDeleting] = useState(false);
const [loopNum, setLoopNum] = useState(0);
const [typingSpeed, setTypingSpeed] = useState(150);

useEffect(() => {
    const i = loopNum % textArray.length;
    const fullText = textArray[i];

    if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
    }

    if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
    }

    const timeout = setTimeout(
        () => {
            setText(
                isDeleting
                    ? fullText.substring(0, text.length - 1)
                    : fullText.substring(0, text.length + 1)
            );
        },
        isDeleting ? 100 : 150
    );

    return () => clearTimeout(timeout);
}, [text, isDeleting, loopNum, textArray]);

  function downloadCV() {
    const link = document.createElement("a");
    link.href = "/resume/Armaan Resume.pdf"; 
    link.download = "Armaan Resume.pdf"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="h-full">
      <div className="container mx-auto h-full p-3">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-xl text-primary uppercase">{text}|</span>
            <h1 className="h1 mb-6">
              Hello I'm <br />{" "}
              <span className="text-primary">Mohammad Armaan</span>
            </h1>
            <p className="max-w-[500px] mb-9 text-dark-background dark:text-white/80">
              Aspiring software developer with a passion for crafting
              responsive, accessible, and modern web interfaces.
            </p>
            <div className="flex flex-col xl:flex-row items-center gap-8">
              <Button
                onClick={downloadCV}
                variant="outline"
                size="lg"
                className="uppercase flex items-center gap-2"
              >
                <span>Download CV</span>
                <FiDownload className="text-xl" />
              </Button>
              <div className="mb-8 xl:mb-0">
                <Social
                  containerStyles="flex gap-6"
                  iconStyles="w-9 h-9 border border-primary rounded-full flex justify-center items-center text-primary text-base hover:bg-dark-background dark:hover:bg-white hover:transition-all duration-500"
                />
              </div>
            </div>
          </div>
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
      <Stats />
    </section>
  );
}
