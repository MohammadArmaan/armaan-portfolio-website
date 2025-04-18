"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, Suspense } from "react";
import CountUp from "react-countup";

export default function Stats() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            }
        >
            <StatsContent />
        </Suspense>
    );
}

function StatsContent() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from("settings")
                .select("*")
                .single(); // get single row

            if (error) {
                console.error("Error fetching stats:", error.message);
                return;
            }

            const statArray = [
                { num: data.experience, text: "Years of Experience" },
                { num: data.projects, text: "Projects Completed" },
                { num: data.technologies, text: "Technologies Mastered" },
                { num: data.hackathons, text: "Hackathons Attended" },
            ];

            setStats(statArray);
        };

        fetchStats();
    }, []);

    if (!stats) {
        return (
            <div className="min-h-[50px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className="mt-10 mb-10 xl:mt-32">
            <div className="container mx-auto p-5">
                <div className="flex flex-wrap gap-6 max-w-[80vw] mx-auto xl:max-w-none">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="flex-1 flex gap-4 items-center justify-center xl:justify-start"
                        >
                            <CountUp
                                end={item.num}
                                duration={5}
                                delay={2}
                                className="text-4xl xl:text-6xl font-extrabold"
                            />
                            <p
                                className={`${
                                    item.text.length < 15
                                        ? "max-w-[100px]"
                                        : "max-w-[150px]"
                                } leading-snug dark:text-white/80 text-gray-600`}
                            >
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
