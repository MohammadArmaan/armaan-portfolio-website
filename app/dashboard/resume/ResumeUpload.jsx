"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ResumeEmedder from "./ResumeEmbedder";

export default function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeUrl, setResumeUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        } else {
            toast.error("Please select a valid PDF file.");
        }
    };

    const uploadResume = async () => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const filePath = "resume/Armaan-Resume"; // Include `.pdf` extension here

        setUploading(true);

        // Step 2: Upload new resume
        const { data, error } = await supabase.storage
            .from("project-images")
            .upload(filePath, file, {
                upsert: true
            });

        if (error) {
            toast.error("Upload failed. Try again.");
            console.error(error);
        } else {
            toast.success("Resume uploaded successfully!");

            const { data: publicData } = supabase.storage
                .from("project-images")
                .getPublicUrl(filePath);

            setResumeUrl(publicData.publicUrl);
        }

        setUploading(false);
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-5">
                <div className="max-w-xl p-8 mx-auto mt-32 bg-[#f2f2f2] dark:bg-[#27272c] rounded-xl shadow-lg">
                    <h2 className="text-3xl font-extrabold text-center mb-6">
                        Upload Resume
                    </h2>

                    <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div className="flex items-center gap-4 border border-primary p-4 rounded-md">
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="p-2 text-sm rounded-full"
                            disabled={uploading}
                        >
                            {file ? "Change File" : "Choose File"}
                        </Button>

                        {file && (
                            <span className="text-sm text-muted-foreground">
                                {file.name}
                            </span>
                        )}
                        {!file && (
                            <span className="text-md text-muted-foreground">
                                No Files Choosen
                            </span>
                        )}
                    </div>

                    <Button
                        className="mt-6 w-full"
                        onClick={uploadResume}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload Resume"}
                    </Button>

                    {resumeUrl && (
                        <div className="mt-6">
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-center hover:underline mt-2 block"
                            >
                                View / Download Resume
                            </a>
                        </div>
                    )}
                </div>
                <ResumeEmedder />
            </div>
        </div>
    );
}
