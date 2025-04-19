"use client"
import { supabase } from "@/lib/supabase";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
    FaGithub,
    FaLinkedinIn,
    FaTwitter,
    FaInstagram,
    FaCode,
} from "react-icons/fa";

export default function Social({ containerStyles, iconStyles }) {
    return (
        <Suspense
            fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            }
        >
            <SocialContent containerStyles={containerStyles} iconStyles={iconStyles} />
        </Suspense>
    );
}

function SocialContent({ containerStyles, iconStyles }) {
        const [socials, setSocials] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
    
        const fetchSocials = useCallback(async () => {
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

            const socials = [
                {
                    icon: <FaGithub />,
                    path: data.github,
                },
                {
                    icon: <FaLinkedinIn />,
                    path: data.linkedln,
                },
                {
                    icon: <FaTwitter />,
                    path: data.twitter,
                },
                {
                    icon: <FaInstagram />,
                    path: data.instagram,
                },
                {
                    icon: <FaCode />,
                    path: data.leetcode,
                },
            ];
    
            setSocials(socials);
            setLoading(false);
        }, []);
    
        useEffect(() => {
            fetchSocials();
        }, [fetchSocials]);
    
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
                    Failed to load links
                </div>
            );
        }
    return (
        <div className={containerStyles}>
            {socials.map((social, index) => (
                <a
                    key={index}
                    href={social.path}
                    target="_blank"
                    rel="noreferrer"
                    className={iconStyles}
                >
                    {social.icon}
                </a>
            ))}
        </div>
    );
}
