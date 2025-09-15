"use client";

import { Button } from "@/components/ui/button";
import { embedResumeFile } from "@/lib/embeddings";
import { supabase } from "@/lib/supabase";
import { useRef, useState } from "react";

export default function ResumeEmedder() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const fileref = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file.");
            return;
        }

        setUploading(true);
        setError(null);
        setResponse(null);

        const filename = "/resume/Armaan-Resume.txt";

        try {
            const { data, error } = await supabase.storage
                .from("project-images")
                .upload(filename, file, {
                    upsert: true,
                    contentType: "plain/text",
                });

            setResponse(data.path);

        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl p-8 mx-auto mt-32 bg-[#f2f2f2] dark:bg-[#27272c] rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-center mb-6">
                        Upload Resume Text for Embeddings
                    </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) =>{

                        setFile(e.target.files[0])
                        setFileName(e.target.files[0].name)
                    } 
                }
                    className="hidden"
                    ref={fileref}
                />
                <div className="border-primary border-2 p-3 rounded-md flex gap-3 items-center">
                    <Button type="button" onClick={() => fileref.current.click()}>
                        Choose File
                    </Button>
                    <span className="text-md text-muted-foreground">{fileName ? fileName : "No Files Choosen"}</span>
                </div>
                <Button
                    type="submit"
                    disabled={uploading}
                    className="mt-2 w-full"
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </Button>
            </form>

            {response && (
                <p className="mt-4 text-primary">
                    ✅ File uploaded successfully: <code>{response}</code>
                </p>
            )}

            {error && <p className="mt-4 text-red-600">❌ Error: {error}</p>}
        </div>
    );
}
