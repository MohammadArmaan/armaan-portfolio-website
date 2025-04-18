"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust path as needed
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
    const [settings, setSettings] = useState({
        experience: "",
        projects: "",
        technologies: "",
        hackathons: "",
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
                });
            } else {
                console.error("Fetch error:", error?.message);
            }
        };

        fetchSettings();
    }, []);

    // Auto-update settings in Supabase
    const handleChange = async (field, value) => {
        const updated = { ...settings, [field]: value };
        setSettings(updated);

        const { error } = await supabase
            .from("settings")
            .upsert({ id: 1, ...updated }); // upsert row with id = 1

        if (error) {
            console.error("Update error:", error.message);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-5">
                <h1 className="text-4xl text-center font-extrabold mt-32 mb-20">
                    Settings
                </h1>
                <div className="grid gap-6 max-w-md mx-auto p-10 rounded-lg bg-[#f2f2f2] dark:bg-[#27272c] shadow-xl">
                    <SettingInput
                        label="Years of Experience"
                        id="experience"
                        value={settings.experience}
                        onChange={(e) =>
                            handleChange("experience", e.target.value)
                        }
                    />
                    <SettingInput
                        label="Projects Completed"
                        id="projects"
                        value={settings.projects}
                        onChange={(e) =>
                            handleChange("projects", e.target.value)
                        }
                    />
                    <SettingInput
                        label="Technologies Mastered"
                        id="technologies"
                        value={settings.technologies}
                        onChange={(e) =>
                            handleChange("technologies", e.target.value)
                        }
                    />
                    <SettingInput
                        label="Hackathons Attended"
                        id="hackathons"
                        value={settings.hackathons}
                        onChange={(e) =>
                            handleChange("hackathons", e.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function SettingInput({ label, id, value, onChange }) {
    return (
        <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="number" value={value} onChange={onChange} />
        </div>
    );
}
