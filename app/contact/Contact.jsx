"use client";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

export default function Social() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            }
        >
            <ContactContent />
        </Suspense>
    );
}

function ContactContent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [message, setMessage] = useState("");
    const [service, setService] = useState("");

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfo = useCallback(async () => {
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

        const info = [
            {
                icon: <FaPhoneAlt />,
                title: "Phone",
                description: data.phone,
            },
            {
                icon: <FaEnvelope />,
                title: "Email",
                description: data.email,
            },
            {
                icon: <FaMapMarkerAlt />,
                title: "Address",
                description: data.address,
            },
        ];

        setInfo(info);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    if (loading) {
        return (
            <div className="min-h-[50px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">Failed to load info</div>
        );
    }

    function handleSubmit(e) {
        e.preventDefault();

        const contactDetails = {
            firstName,
            lastName,
            email,
            phoneNo,
            service,
            message,
        };

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phoneNo ||
            !service ||
            !message
        ) {
            toast.error("Please fill out all fields", {
                action: {
                    label: "Close",
                    onClick: () => {},
                },
            });
            return;
        }

        // Save to Supabase
        supabase
            .from("contact")
            .insert([contactDetails])
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error submitting form:", error);
                } else {
                    emailjs
                        .send(
                            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                            {
                                from_name: `${firstName} ${lastName}`,
                                from_email: email,
                                phone: phoneNo,
                                service,
                                message,
                            },
                            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                        )
                        .then(
                            () => {
                                toast.success("Message sent successfully!", {
                                    action: {
                                        label: "Close",
                                        onClick: () => {},
                                    },
                                });

                                setFirstName("");
                                setLastName("");
                                setEmail("");
                                setPhoneNo("");
                                setService("");
                                setMessage("");
                            },
                            (error) => {
                                console.error("EmailJS error:", error);
                                toast.error("Failed to send email.");
                            }
                        );
                }
            });
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
            }}
            className="py-6"
        >
            <div className="container mx-auto p-5">
                <div className="flex flex-col xl:flex-row gap-[30px]">
                    <div className="xl:h-[54%] order-2 xl:order-none">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6 p-7 lg:p-10 bg-[#eee] dark:bg-[#27272c] rounded-xl"
                        >
                            <h3 className="text-4xl text-primary">
                                Let's Work Together
                            </h3>
                            <p className="text-foreground/80">
                                Got a project idea, collaboration proposal, or
                                just want to say hi?
                            </p>
                            <p className="text-foreground/80">
                                Feel free to drop me a message. I&apos;ll get
                                back to you as soon as possible.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    type="text"
                                    placeholder="Firstname"
                                    required
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                                <Input
                                    type="text"
                                    placeholder="Lastname"
                                    required
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                />
                            </div>

                            <Select value={service} onValueChange={setService}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Services</SelectLabel>
                                        <SelectItem value="web">
                                            Web Development
                                        </SelectItem>
                                        <SelectItem value="freelance">
                                            Freelance Project Consulting
                                        </SelectItem>
                                        <SelectItem value="ui-ux">
                                            UI/UX Design & Integration
                                        </SelectItem>
                                        <SelectItem value="api">
                                            API Development & Integration
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Textarea
                                className="h-[200px]"
                                placeholder="Enter Your Message Here..."
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <Button
                                type="submit"
                                size="md"
                                className="max-w-40 p-2"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info Panel */}
                    <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
                        <ul className="flex flex-col gap-10">
                            {info.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-6"
                                >
                                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#eee] dark:bg-[#27272c] text-primary rounded-md flex items-center justify-center">
                                        <div className="text-[28px]">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 max-w-[250px]">
                                        <p className="text-foreground/80">
                                            {item.title}
                                        </p>
                                        <h3 className="text-sm truncate">
                                            {item.description}
                                        </h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
