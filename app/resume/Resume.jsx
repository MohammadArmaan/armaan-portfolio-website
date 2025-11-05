"use client";

import { FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiMongodb, SiExpress, SiPrisma, SiMysql, SiTypescript, SiSolidity, SiDrizzle, SiFigma, SiGooglegemini } from "react-icons/si";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import "swiper/css";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

const experience = {
    icon: "/resume/badge.svg",
    title: "My Experience",
    description:
        "As a Computer Science student, I’ve gained real-world experience through freelance roles at SR Portraits and Events and Apna Bazar. These full-stack projects sharpened my problem-solving skills, taught me client collaboration, and helped me build responsive, user-focused solutions—all while managing my academic journey.",

    items: [
        {
            company: "SR Potraits and Events",
            position: "Full Stack Intern",
            duration: "2024 - Present",
        },
        {
            company: "Apna Bazar",
            position: "Web Developer Intern",
            duration: "Summer 2024",
        },
    ],
};

const education = {
    icon: "/resume/cap.svg",
    title: "My Education",
    description:
        "My academic journey reflects a strong foundation in science and technology, which has helped me grow as a web developer and problem solver. I've pursued formal education with a focus on engineering and computer science, building both theoretical knowledge and practical skills.",

    items: [
        {
            institution: "Don Bosco Institue of Technology",
            program: "Bachelor's of Engineering",
            duration: "2022 - Present",
        },
        {
            institution: "SBM Jain PU College",
            program: "Pre University Course (Science)",
            duration: "2020 - 2022",
        },
        {
            institution: "Embassy Public School",
            program: "High School Certification",
            duration: "2012 - 2020",
        },
    ],
};

const skills = {
    title: "My Skills",
    description:
        "I’m a full-stack web developer skilled in building responsive and scalable applications. I specialize in frontend development with React and Next.js, and backend logic with Node.js, Express, and MongoDB. From clean HTML/CSS to robust APIs, I deliver efficient and user-friendly web solutions.",
    skillList: [
        {
            icon: <FaHtml5 />,
            name: "HTML 5",
        },
        {
            icon: <FaCss3 />,
            name: "CSS 3",
        },
        {
            icon: <FaJs />,
            name: "Javascript",
        },
        {
            icon: <SiTypescript />,
            name: "Typescript",
        },
        {
            icon: <SiSolidity />,
            name: "Solidity",
        },
        {
            icon: <FaNodeJs />,
            name: "Node.js",
        },
                {
            icon: <SiExpress />,
            name: "Express",
        },
        {
            icon: <FaReact />,
            name: "React",
        },
        {
            icon: <RiNextjsFill />,
            name: "Next.js",
        },
        {
            icon: <RiTailwindCssFill />,
            name: "Tailwind CSS",
        },
        {
            icon: <SiFigma />,
            name: "Figma",
        },
        {
            icon: <SiGooglegemini />,
            name: "Google Gemini",
        },
        {
            icon: <SiMongodb />,
            name: "MongoDB",
        },
        {
            icon: <SiMysql />,
            name: "MySql",
        },
        {
            icon: <SiPrisma />,
            name: "Prisma",
        },
        {
            icon: <SiDrizzle />,
            name: "Drizzle",
        },
    ],
};

export default function Resume() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            }
        >
            <ResumeContent />
        </Suspense>
    );
}

function ResumeContent() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState("about");

    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
        setMounted(true);
    }, [tabParam]);

    const fetchAbout = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .single();

        if (error) {
            console.error("Error fetching stats:", error.message);
            setError(error.message);
            setLoading(false);
            return;
        }

        const about = {
            title: "About Me",
            description: data.description,

            info: [
                { fieldName: "Name", fieldValue: data.name },
                { fieldName: "Phone", fieldValue: data.phone },
                {
                    fieldName: "Experience",
                    fieldValue: `${data.experience}+ Years`,
                },
                { fieldName: "Nationality", fieldValue: data.nationality },
                { fieldName: "Email", fieldValue: data.email },
                { fieldName: "Freelance", fieldValue: data.freelance },
                { fieldName: "Languages", fieldValue: data.languages },
            ],
        };
        setAbout(about);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAbout();
    }, [fetchAbout]);

    if (loading) {
        return (
            <div className="min-h-[50px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                Failed to load detals
            </div>
        );
    }

    const handleTabChange = (value) => {
        setActiveTab(value);

        const params = new URLSearchParams(window.location.search);

        if (value === "about") {
            router.push("/resume", { scroll: false });
        } else {
            params.set("tab", value);
            router.push(`/resume?${params.toString()}`, { scroll: false });
        }
    };

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 1.4, duration: 0.4, ease: "easeIn" },
            }}
            className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0 p-5"
        >
            <div className="container mx-auto">
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="flex flex-col xl:flex-row gap-[60px]"
                >
                    <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
                        <TabsTrigger value="about">About Me</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[70vh] w-full">
                        <TabsContent
                            value="about"
                            className="w-full h-full text-center xl:text-left"
                        >
                            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-[30px]">
                                <div className="w-full max-w-[350px] flex-shrink-0">
                                    <img
                                        src={`${
                                            currentTheme === "dark"
                                                ? "/photo-dark-02.png"
                                                : "/photo-03.png"
                                        }`}
                                        alt="Mohammad Armaan"
                                        className="w-full h-auto rounded-full shadow-lg object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-[30px] max-w-full lg:max-w-[700px]">
                                    <h3 className="text-4xl font-bold">
                                        {about.title}
                                    </h3>
                                    <p className="text-foreground/80">
                                        {about.description}
                                    </p>
                                    <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-10 w-full">
                                        {about.info.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-center lg:justify-start gap-4"
                                            >
                                                <span className="text-foreground/80 text-xs">
                                                    {item.fieldName}
                                                </span>
                                                <TooltipProvider
                                                    delayDuration={100}
                                                >
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <span className="text-sm truncate whitespace-nowrap max-w-[250px] lg:max-w-[200px] inline-block">
                                                                {
                                                                    item.fieldValue
                                                                }
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <span className="text-sm">
                                                                {
                                                                    item.fieldValue
                                                                }
                                                            </span>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="skills" className="w-full h-full">
                            <div className="flex flex-col gap-[30px]">
                                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                    <h3 className="text-4xl font-bold">
                                        {skills.title}
                                    </h3>
                                    <p className="max-w-[600px] text-foreground/80 mx-auto xl:mx-0">
                                        {skills.description}
                                    </p>
                                </div>
                                <ScrollArea className="h-[400px]">
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:gap-[30px] gap-4">
                                        {skills.skillList.map(
                                            (skill, index) => (
                                                <li
                                                    key={index}
                                                    className="group"
                                                >
                                                    <TooltipProvider
                                                        delayDuration={100}
                                                    >
                                                        <Tooltip>
                                                            <TooltipTrigger className="w-full h-[150px] bg-[#f2f2f2] dark:bg-[#27272c] rounded-xl flex justify-center items-center">
                                                                <div className="text-6xl hover-icon transition-all duration-300">
                                                                    {skill.icon}
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="capitalize">
                                                                    {skill.name}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </ScrollArea>
                            </div>
                        </TabsContent>
                        <TabsContent value="education" className="w-full">
                            <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                <h3 className="text-4xl font-bold">
                                    {education.title}
                                </h3>
                                <p className="max-w-[600px] text-foreground/80 mx-auto xl:mx-0">
                                    {education.description}
                                </p>
                                <ScrollArea className="h-[400px]">
                                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                        {education.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className=" bg-[#f2f2f2] dark:bg-[#27272c] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                                            >
                                                <span className="text-primary">
                                                    {item.duration}
                                                </span>
                                                <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                                                    {item.program}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-[6px] h-[6px] rounded-full bg-primary"></span>
                                                    <p className="text-foreground/80">
                                                        {item.institution}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </div>
                        </TabsContent>
                        <TabsContent value="experience" className="w-full">
                            <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                <h3 className="text-4xl font-bold">
                                    {experience.title}
                                </h3>
                                <p className="max-w-[600px] text-foreground/80 mx-auto xl:mx-0">
                                    {experience.description}
                                </p>
                                <ScrollArea className="h-[400px]">
                                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                        {experience.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className=" bg-[#f2f2f2] dark:bg-[#27272c] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                                            >
                                                <span className="text-primary">
                                                    {item.duration}
                                                </span>
                                                <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                                                    {item.position}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-[6px] h-[6px] rounded-full bg-primary"></span>
                                                    <p className="text-foreground/80">
                                                        {item.company}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </motion.div>
    );
}
