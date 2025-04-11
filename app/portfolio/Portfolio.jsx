"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";
import { portfolioData } from "@/data/portfolio";

const uniqueCategories = [
    "all categories",
    ...Array.from(new Set(portfolioData.map((p) => p.category.toLowerCase()))),
];

export default function Portfolio() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryFromUrl =
        searchParams.get("category")?.toLowerCase() || "all categories";
    const [category, setCategory] = useState(categoryFromUrl);

    useEffect(() => {
        if (category !== categoryFromUrl) {
            const newUrl =
                category === "all categories"
                    ? "/portfolio"
                    : `/portfolio?category=${category}`;
            router.push(newUrl, { scroll: false });
        }
    }, [category, categoryFromUrl, router]);

    useEffect(() => {
        setCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    const filteredProjects = portfolioData.filter((project) =>
        category === "all categories"
            ? true
            : project.category.toLowerCase() === category
    );

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
                }}
                className="min-h-[90vh] flex py-12 px-5" 
            >
                <div className="container mx-auto max-w-7xl w-full">
                    <h1 className="text-5xl font-extrabold mb-12 text-center">
                        My Portfolio
                    </h1>

                    <Tabs
                        value={category}
                        onValueChange={setCategory}
                        className="w-full"
                    >
                        <TabsList
                            className="flex flex-col 
                            gap-3 
                            mb-12 
                            lg:flex-row 
                            lg:justify-center 
                            lg:items-center"
                        >
                            {uniqueCategories.map((cat, index) => (
                                <TabsTrigger
                                    value={cat}
                                    key={index}
                                    className="capitalize px-4 py-2 text-sm border dark:border-none"
                                >
                                    {cat}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent
                            value={category}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center"
                        >
                            {filteredProjects.map((project, index) => (
                                <ProjectCard project={project} key={index} />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>
        </Suspense>
    );
}
