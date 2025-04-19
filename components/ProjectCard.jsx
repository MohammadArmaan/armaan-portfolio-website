"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card } from "./ui/card";
import { BsGithub, BsLink } from "react-icons/bs";

export default function ProjectCard({ project }) {
    const [showIcons, setShowIcons] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    const handleClick = () => {
        if (isMobile) setShowIcons((prev) => !prev);
    };

    return (
        <Card
            onClick={handleClick}
            className="group w-full max-w-sm md:max-w-md lg:max-w-[350px] overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all p-0 cursor-pointer"
        >
            <div className="relative h-[200px] w-full overflow-hidden rounded-t-xl">
                <Image
                    src={project.image_url}
                    alt={project.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all" />

                <Badge className="absolute top-3 left-3 z-20 uppercase text-xs font-medium bg-primary text-dark-background px-2 py-1 rounded-md">
                    {project.category}
                </Badge>

                <div
                    className={`absolute inset-0 flex justify-center items-center gap-3 z-10 transition-all duration-300
                    ${
                        isMobile
                            ? showIcons
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-0"
                            : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                >
                    {project.live && (
                        <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-secondary w-9 h-9 flex justify-center items-center rounded-full"
                        >
                            <BsLink className="text-primary text-xl" />
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-secondary w-9 h-9 flex justify-center items-center rounded-full"
                        >
                            <BsGithub className="text-primary text-xl" />
                        </a>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-dark-background px-4 py-3 rounded-b-xl">
                <h4 className="text-base font-semibold mb-1 leading-snug">
                    {project.name}
                </h4>
                <p className="text-sm text-muted-foreground leading-normal line-clamp-3">
                    {project.description}
                </p>
            </div>
        </Card>
    );
}
