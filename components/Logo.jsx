"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logo() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <Link href="/">
            <Image
                src={currentTheme === "dark" ? "/logo-dark.png" : "/logo.png"}
                width={200}
                height={200}
                priority
                alt="Logo"
            />
        </Link>
    );
}
