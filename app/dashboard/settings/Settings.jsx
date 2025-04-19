"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust path as needed
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Settings() {
    const [settings, setSettings] = useState({
        experience: "0",
        projects: "0",
        technologies: "0",
        hackathons: "0",
        github: "",
        linkedln: "",
        instagram: "",
        twitter: "",
        leetcode: "",
        name: "",
        email: "",
        phone: "",
        freelance: "",
        languages: "",
        nationality: "",
        address: "",
        description: "",
    });

    // Fetch existing settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("settings")
                .select("*")
                .eq("id", 1)
                .single();

            if (data) {
                setSettings({
                    experience: data.experience || "",
                    projects: data.projects || "",
                    technologies: data.technologies || "",
                    hackathons: data.hackathons || "",
                    github: data.github || "",
                    linkedln: data.linkedln || "",
                    instagram: data.instagram || "",
                    twitter: data.twitter || "",
                    leetcode: data.leetcode || "",
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    freelance: data.freelance || "",
                    languages: data.languages || "",
                    nationality: data.nationality || "",
                    address: data.address || "",
                    description: data.description || "",
                });
            } else {
                console.error("Fetch error:", error?.message);
            }
        };

        fetchSettings();
    }, []);

    // Auto-update settings in Supabase
    const handleChange = async (field, value) => {
        // For social links, auto-add https:// if missing
        const isSocialField = [
            "github",
            "linkedln",
            "instagram",
            "twitter",
            "leetcode",
        ].includes(field);

        let updatedValue = value;

        const numberFields = [
            "projects",
            "technologies",
            "hackathons",
            "experience",
        ];

        if (numberFields.includes(field)) {
            updatedValue = value === "" ? "0" : Number(value);
        }

        if (
            isSocialField &&
            value.length > 0 &&
            !value.startsWith("http://") &&
            !value.startsWith("https://")
        ) {
            updatedValue = "https://" + value;
        }

        const updated = { ...settings, [field]: updatedValue };
        setSettings(updated);

        const { error } = await supabase
            .from("settings")
            .upsert({ id: 1, ...updated });

        if (error) {
            console.error("Update error:", error.message);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-5">
                <h1 className="text-4xl text-center font-extrabold mt-20 mb-20">
                    Settings
                </h1>
                <div className="grid gap-6 max-w-md mx-auto p-7 rounded-lg mb-10 bg-[#f2f2f2] dark:bg-[#27272c] shadow-xl">
                    <h1 className="text-center text-3xl mb-3 font-bold">
                        Personal Info
                    </h1>
                    <PersonalInput
                        label="Name"
                        id="name"
                        value={settings.name}
                        type="text"
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <PersonalInput
                        label="Email"
                        id="email"
                        value={settings.email}
                        type="email"
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <PersonalInput
                        label="Phone"
                        id="phone"
                        value={settings.phone}
                        type="tel"
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    <PersonalInput
                        label="Nationality"
                        id="nationality"
                        value={settings.nationality}
                        type="text"
                        onChange={(e) =>
                            handleChange("nationality", e.target.value)
                        }
                    />
                    <PersonalInput
                        label="Freelance"
                        id="freelance"
                        value={settings.freelance}
                        type="text"
                        onChange={(e) =>
                            handleChange("freelance", e.target.value)
                        }
                    />
                    <PersonalInput
                        label="Languages"
                        id="languages"
                        value={settings.languages}
                        type="text"
                        onChange={(e) =>
                            handleChange("languages", e.target.value)
                        }
                    />
                    <PersonalInput
                        label="Address"
                        id="address"
                        value={settings.address}
                        type="text"
                        onChange={(e) =>
                            handleChange("address", e.target.value)
                        }
                    />
                    <PersonalTextarea
                        label="About Description"
                        id="description"
                        value={settings.description}
                        type="text"
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                    />
                </div>
                <div className="grid gap-6 max-w-md mx-auto p-7 rounded-lg mb-10 bg-[#f2f2f2] dark:bg-[#27272c] shadow-xl">
                    <h1 className="text-center text-3xl mb-3 font-bold">
                        Stats
                    </h1>
                    <StatsInput
                        label="Years of Experience"
                        id="experience"
                        value={settings.experience}
                        type="number"
                        onChange={(e) =>
                            handleChange("experience", e.target.value)
                        }
                    />
                    <StatsInput
                        label="Projects Completed"
                        id="projects"
                        value={settings.projects}
                        type="number"
                        onChange={(e) =>
                            handleChange("projects", e.target.value)
                        }
                    />
                    <StatsInput
                        label="Technologies Mastered"
                        id="technologies"
                        value={settings.technologies}
                        type="number"
                        onChange={(e) =>
                            handleChange("technologies", e.target.value)
                        }
                    />
                    <StatsInput
                        label="Hackathons Attended"
                        id="hackathons"
                        value={settings.hackathons}
                        type="number"
                        onChange={(e) =>
                            handleChange("hackathons", e.target.value)
                        }
                    />
                </div>
                <div className="grid gap-6 max-w-md mx-auto p-7 rounded-lg mb-10 bg-[#f2f2f2] dark:bg-[#27272c] shadow-xl">
                    <h1 className="text-center text-3xl mb-3 font-bold">
                        Social
                    </h1>
                    <SocialInput
                        label="Github"
                        id="github"
                        value={settings.github}
                        type="text"
                        onChange={(e) => handleChange("github", e.target.value)}
                    />
                    <SocialInput
                        label="Linkedln"
                        id="linkedln"
                        value={settings.linkedln}
                        type="text"
                        onChange={(e) =>
                            handleChange("linkedln", e.target.value)
                        }
                    />
                    <SocialInput
                        label="Instagram"
                        id="instagram"
                        value={settings.instagram}
                        type="text"
                        onChange={(e) =>
                            handleChange("instagram", e.target.value)
                        }
                    />
                    <SocialInput
                        label="Twitter"
                        id="twitter"
                        value={settings.twitter}
                        type="text"
                        onChange={(e) =>
                            handleChange("twitter", e.target.value)
                        }
                    />
                    <SocialInput
                        label="Leetcode"
                        id="leetcode"
                        value={settings.leetcode}
                        type="text"
                        onChange={(e) =>
                            handleChange("leetcode", e.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function StatsInput({ label, id, value, onChange, type }) {
    return (
        <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type={type} value={value} onChange={onChange} />
        </div>
    );
}
function SocialInput({ label, id, value, onChange, type }) {
    return (
        <div className="flex flex-col items-start gap-4">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full"
            />
        </div>
    );
}
function PersonalInput({ label, id, value, onChange, type }) {
    return (
        <div className="flex flex-col items-start gap-4">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full"
            />
        </div>
    );
}
function PersonalTextarea({ label, id, value, onChange, type }) {
    return (
        <div className="flex flex-col items-start gap-4">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full"
            />
        </div>
    );
}
