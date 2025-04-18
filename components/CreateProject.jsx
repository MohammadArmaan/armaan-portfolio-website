"use client";

import { useRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

export default function CreateProject({ projectDetails, setProjectDetails }) {
    const fileInputRef = useRef(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const filePath = `projects/${Date.now()}-${file.name}`;

        // Upload image to Supabase Storage
        const { data, error } = await supabase.storage
            .from("project-images") // ⬅️ replace with your bucket name
            .upload(filePath, file);

        if (error) {
            console.error("Upload error:", error.message);
            return;
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        setProjectDetails({
            ...projectDetails,
            image_url: publicUrl,
            image_name: file.name,
        });
    };

    return (
        <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-num" className="text-right">
                    Num
                </Label>
                <Input
                    id="edit-num"
                    value={projectDetails.num}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            num: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                    Title
                </Label>
                <Input
                    id="edit-title"
                    value={projectDetails.title}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            title: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                    Category
                </Label>
                <Input
                    id="edit-category"
                    value={projectDetails.category}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            category: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* Stack */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stack" className="text-right">
                    Stack
                </Label>
                <Input
                    id="edit-stack"
                    value={projectDetails.stack}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            stack: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* Live */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-live" className="text-right">
                    Live
                </Label>
                <Input
                    id="edit-live"
                    value={projectDetails.live}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            live: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* GitHub */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-github" className="text-right">
                    Github
                </Label>
                <Input
                    id="edit-github"
                    value={projectDetails.github}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            github: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                    Description
                </Label>
                <Textarea
                    id="edit-description"
                    value={projectDetails.description}
                    onChange={(e) =>
                        setProjectDetails({
                            ...projectDetails,
                            description: e.target.value,
                        })
                    }
                    className="col-span-3"
                />
            </div>

            {/* Image Upload */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                    Image
                </Label>
                <div className="col-span-3 flex items-center gap-2 border p-2 rounded-md">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        className="rounded-md p-1"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Choose Image
                    </Button>
                    {projectDetails.image_name && (
                        <span className="text-sm text-muted-foreground">
                            {projectDetails.image_name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
