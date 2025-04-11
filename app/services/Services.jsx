"use client";

import { BsArrowDownRight } from "react-icons/bs";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
    {
        num: "01",
        title: "Full-Stack Web Development",
        description:
            "Building dynamic, scalable, and responsive web applications using modern technologies like React, Node.js, and Next.js.",
        href: "/contact",
    },
    {
        num: "02",
        title: "Freelance Project Consulting",
        description:
            "Providing expert advice, architecture planning, and implementation strategies for freelance and client-based projects.",
        href: "/contact",
    },
    {
        num: "03",
        title: "UI/UX Design & Integration",
        description:
            "Crafting user-friendly interfaces with intuitive user experiences, seamlessly integrating design into frontend development.",
        href: "/contact",
    },
    {
        num: "04",
        title: "API Development & Integration",
        description:
            "Developing robust RESTful APIs and integrating third-party services like Stripe, Auth, and Maps to enhance web app functionality.",
        href: "/contact",
    },
];

export default function Services() {
    return (
        <div className="container mx-auto p-5">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
            >
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex-1 flex flex-col justify-center gap-6 group"
                    >
                        <div className="w-full flex justify-between items-center">
                            <div className="text-5xl font-extrabold text-outline text-transparent transition-all duration-500">
                                {service.num}
                            </div>
                            <Link
                                href={service.href}
                                className="w-[70px] h-[70px] rounded-full dark:bg-white bg-dark-background transition-all duration-500 flex hover-background justify-center items-center hover:-rotate-45"
                            >
                                <BsArrowDownRight className="text-white dark:text-dark-background text-3xl" />
                            </Link>
                        </div>
                        <h2 className="text-[42px] font-bold leading-none text-foreground hover-text transition-all duration-500">{service.title}</h2>
                        <p className="text-muted-foreground">{service.description}</p>
                        <div className="border-b border-gray-600 dark:border-white/20 w-full"></div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
