"use client";

import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { BsGithub, BsLink } from "react-icons/bs";
import { supabase } from "@/lib/supabase";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import WorkSliderBtns from "@/components/WorkSliderBtns";

export default function Projects() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin" />
        </div>
      }
    >
      <ProjectContent />
    </Suspense>
  );
}

async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data;
}

function ProjectContent() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await fetchProjects();
      setProjects(data);
      setProject(data[0]); // set first project
    }

    load();
  }, []);

  function handleSlideChange(swiper) {
    const currentIndex = swiper.activeIndex;
    setProject(projects[currentIndex]);
  }

  if (!project)
    return <div className="text-center py-20">Loading projects...</div>;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 1.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto p-5">
        <div className="flex flex-col xl:flex-row xl:gap-[30px]">
          {/* Left side */}
          <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
            <div className="group flex flex-col gap-[30px] h-[50%]">
              <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                {project.num}
              </div>
              <h2 className="text-[42px] font-bold leading-none text-foreground hover-text transition-all duration-500 capitalize">
                {project.title}
              </h2>
              <p className="text-foreground/80 capitalize">
                {project.category} project
              </p>
              <p className="text-foreground/80">{project.description}</p>
              <ul className="flex gap-4 flex-wrap">
                {project.stack?.split(" ").map((item, index) => (
                  <li key={index} className="text-xl text-primary">
                    {typeof item === "object" ? item.name : item}
                  </li>
                ))}
              </ul>
              <div className="border border-foreground/20"></div>
              <div className="flex items-center gap-4">
                <a href={project.live} target="_blank">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-foreground/5 flex justify-center items-center group">
                        <BsLink className="text-foreground hover-icon text-3xl" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Live Project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </a>
                <a href={project.github} target="_blank">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-foreground/5 flex justify-center items-center group">
                        <BsGithub className="text-foreground hover-icon text-3xl" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Github Repo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </a>
              </div>
            </div>
          </div>

          {/* Right side - Swiper */}
          <div className="w-full xl:w-[50%]">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="xl:h-[520px] mb-12"
              onSlideChange={handleSlideChange}
            >
              {projects.map((p, index) => (
                <SwiperSlide key={index} className="w-full">
                  <div className="relative w-full aspect-[4/3] xl:aspect-auto xl:h-[460px] group bg-foreground/20 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-black/10 z-10" />
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </SwiperSlide>
              ))}
              <WorkSliderBtns
                containerStyls="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                btnStyles="bg-primary hover:bg-primary-hover text-dark-background text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all"
              />
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
