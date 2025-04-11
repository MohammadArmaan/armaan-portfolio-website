"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const links = [
    {
        name: "home",
        path: "/"
    },
    {
        name: "services",
        path: "/services"
    },
    {
        name: "resume",
        path: "/resume"
    },
    {
        name: "projects",
        path: "/projects"
    },
    {
        name: "portfolio",
        path: "/portfolio"
    },
]

export default function Nav() {
    const pathname = usePathname()
    return (
        <nav className="flex items-center gap-8">
            {links.map((link, index) => (
                <Link href={link.path} key={index} className={`${link.path === pathname && "text-primary border-b-2 border-primary"} capitalize font-medium hover:text-primary transition-all`}>{link.name}</Link>
            ))}
            <Link href="/contact">
                <Button className="rounded-full cursor-pointer">
                    Reach Out
                </Button>
            </Link>
        </nav>
    );
}
