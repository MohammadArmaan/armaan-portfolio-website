"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

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
        name: "settings",
        path: "/dashboard/settings",
    },
];

export default function Nav({ isDashboard }) {
    const pathname = usePathname();
    return (
        <>
            {!isDashboard && (
                <nav className="flex items-center gap-8">
                    {links.map((link, index) => (
                        <Link
                            href={link.path}
                            key={index}
                            className={`${
                                link.path === pathname &&
                                "text-primary border-b-2 border-primary"
                            } capitalize font-medium hover:text-primary transition-all`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/contact">
                        <Button className="rounded-full cursor-pointer">
                            Reach Out
                        </Button>
                    </Link>
                </nav>
            )}
            {isDashboard && (
                <nav className="flex items-center gap-8">
                    {dashboardLinks.map((link, index) => (
                        <Link
                            href={link.path}
                            key={index}
                            className={`${
                                link.path === pathname &&
                                "text-primary border-b-2 border-primary"
                            } capitalize font-medium hover:text-primary transition-all`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/">
                        <Button className="rounded-full cursor-pointer">
                            Home
                        </Button>
                    </Link>
                </nav>
            )}
        </>
    );
}
