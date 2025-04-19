"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/lib/supabase";
import { Loader } from "lucide-react";

export default function Portfolio() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            }
        >
            <PortfolioContent />
        </Suspense>
    );
}

async function fetchPortfolio() {
    const { data, error } = await supabase.from("portfolio").select("*");
    if (error) {
        console.error("Error fetching portfolio:", error);
        return [];
    }
    return data;
}

function PortfolioContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryFromUrl =
        searchParams.get("category")?.toLowerCase() || "all categories";
    const [category, setCategory] = useState(categoryFromUrl);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial data fetch
    useEffect(() => {
        async function load() {
            const data = await fetchPortfolio();
            setProjects(data);
            setLoading(false);
        }

        load();
    }, []);

    // Update URL if category changes
    useEffect(() => {
        if (category !== categoryFromUrl) {
            const newUrl =
                category === "all categories"
                    ? "/portfolio"
                    : `/portfolio?category=${category}`;
            router.push(newUrl, { scroll: false });
        }
    }, [category, categoryFromUrl, router]);

    // Keep category state in sync with the URL
    useEffect(() => {
        setCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    const uniqueCategories = [
        "all categories",
        ...Array.from(new Set(projects.map((p) => p.category.toLowerCase()))),
    ];

    const filteredProjects = projects.filter((project) =>
        category === "all categories"
            ? true
            : project.category.toLowerCase() === category
    );

    if (loading) {
        return (
            <div className="min-h-[50px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 1.4, duration: 0.4, ease: "easeIn" },
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
    );
}
