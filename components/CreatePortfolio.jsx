"use client";

import { useRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

export default function CreatePortfolio({
    portfolioDetails,
    setPortfolioDetails,
}) {
    const fileInputRef = useRef(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const filePath = `portfolio/${Date.now()}-${file.name}`;

        // Upload image to Supabase Storage
        const { data, error } = await supabase.storage
            .from("project-images")
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

        setPortfolioDetails({
            ...portfolioDetails,
            image_url: publicUrl,
            image_name: file.name,
        });
    };

    return (
        <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                    Name
                </Label>
                <Input
                    id="edit-name"
                    value={portfolioDetails.name}
                    onChange={(e) =>
                        setPortfolioDetails({
                            ...portfolioDetails,
                            name: e.target.value,
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
                    value={portfolioDetails.category}
                    onChange={(e) =>
                        setPortfolioDetails({
                            ...portfolioDetails,
                            category: e.target.value,
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
                    value={portfolioDetails.live}
                    onChange={(e) =>
                        setPortfolioDetails({
                            ...portfolioDetails,
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
                    value={portfolioDetails.github}
                    onChange={(e) =>
                        setPortfolioDetails({
                            ...portfolioDetails,
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
                    value={portfolioDetails.description}
                    onChange={(e) =>
                        setPortfolioDetails({
                            ...portfolioDetails,
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
                    {portfolioDetails.image_name && (
                        <span className="text-sm text-muted-foreground">
                            {portfolioDetails.image_name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
