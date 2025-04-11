"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        async function fetchContacts() {
            const { data, error } = await supabase.from("contact").select("*");
            if (data) setContacts(data);
            if (error) console.error(error);
        }

        fetchContacts();
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
            }}
            className="min-h-[90vh] flex py-12 px-5"
        >
            <div className="container mx-auto p-5">
                <h1 className="text-5xl text-center font-extrabold mb-10">
                    Contact Responses
                </h1>
                <ul className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    {contacts.map((contact) => (
                        <li
                            key={contact.id}
                            className="p-4 bg-[#eee] dark:bg-[#27272c] rounded-xl shadow"
                        >
                            <p className="font-medium">
                                {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Email:{" "}
                                <span className="text-md text-foreground">
                                    {contact.email}
                                </span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Phone Number:{" "}
                                <span className="text-md text-foreground capitalize">
                                    {contact.phoneNo}
                                </span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Service Needed:{" "}
                                <span className="text-md text-foreground capitalize">
                                    {contact.service}
                                </span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Message:{" "}
                                <span className="text-md text-foreground">
                                    {contact.message}
                                </span>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.section>
    );
}
