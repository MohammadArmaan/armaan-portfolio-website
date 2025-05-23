"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useState } from "react";

const links = [
    {
        name: "home",
        path: "/",
    },
    {
        name: "services",
        path: "/services",
    },
    {
        name: "resume",
        path: "/resume",
    },
    {
        name: "projects",
        path: "/projects",
    },
    {
        name: "portfolio",
        path: "/portfolio",
    },
];

const dashboardLinks = [
    {
        name: "contacts",
        path: "/dashboard",
    },
    {
        name: "portfolio",
        path: "/dashboard/portfolio",
    },
    {
        name: "projects",
        path: "/dashboard/projects",
    },
    {
        name: "resume",
        path: "/dashboard/resume",
    },
    {
        name: "settings",
        path: "/dashboard/settings",
    },
];

export default function MobileNav({ isDashboard }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex items-center justify-center">
                <CiMenuFries className="text-[32px] text-primary" />
            </SheetTrigger>
            <SheetContent>
                {/* Accessibility additions */}
                <SheetTitle className="sr-only">Main Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                    Navigate to various sections of the site
                </SheetDescription>

                <div className="mt-32 flex items-center justify-center">
                    <Logo />
                </div>
                {!isDashboard && (
                    <nav className="flex flex-col items-center justify-center gap-8 mt-15">
                        {links.map((link, index) => (
                            <Link
                                href={link.path}
                                key={index}
                                className={`${
                                    link.path === pathname &&
                                    "border-b-2 border-primary text-primary"
                                } capitalize text-xl hover:text-primary transition-aall`}
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/contact" onClick={() => setOpen(false)}>
                            <Button className="rounded-full cursor-pointer">
                                Reach Out
                            </Button>
                        </Link>
                    </nav>
                )}
                {isDashboard && (
                    <nav className="flex flex-col items-center justify-center gap-8 mt-15">
                        {dashboardLinks.map((link, index) => (
                            <Link
                                href={link.path}
                                key={index}
                                className={`${
                                    link.path === pathname &&
                                    "border-b-2 border-primary text-primary"
                                } capitalize text-xl hover:text-primary transition-aall`}
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/" onClick={() => setOpen(false)}>
                            <Button className="rounded-full cursor-pointer">
                                Home
                            </Button>
                        </Link>
                    </nav>
                )}
            </SheetContent>
        </Sheet>
    );
}
