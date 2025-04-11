"use client";

import Logo from "./Logo";
import ThemeToggler from "./ThemeToggler";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import { useEffect, useState } from "react";

export default function Header() {
    const [header, setHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setHeader(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <header
            className={`px-4 md:px-0 py-8  dark:text-white text-black sticky top-0 z-30 transition-all ${
                header ? "bg-white shadow-md dark:bg-accent py-4" : ""
            }`}
        >
            <div className="container mx-auto flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-x-6">
                    <div className="hidden xl:flex">
                        <Nav />
                    </div>
                    <ThemeToggler />
                    <div className="xl:hidden">
                        <MobileNav />
                    </div>
                </div>
            </div>
        </header>
    );
}
