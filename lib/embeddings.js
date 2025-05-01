import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

// Load and embed the file from Supabase's project-images bucket
export async function embedResumeFile(filePath) {
  try {
    // 1. Download the file from the 'project-images' bucket
    const { data: file, error } = await supabase.storage
      .from("project-images")
      .download(filePath);

    if (error) throw new Error("Failed to download file: " + error.message);

    const text = await file.text();

    // 2. Split the text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([text]);

    // 3. Create Google Embeddings client
    const embedder = new GoogleGenerativeAIEmbeddings({
      modelName: "embedding-001",
      apiKey: "AIzaSyAzDGuCQDrnZBlXw-PmdCl3Ojn3JquSxQo", // ⚠️ Move this to an env variable for security
    });

    const vectors = await embedder.embedDocuments(docs.map((d) => d.pageContent));

    // 4. Store each embedding and its corresponding chunk
    for (let i = 0; i < docs.length; i++) {
      const content = docs[i].pageContent;
      const embedding = vectors[i];

      await supabase.from("resume_embeddings").insert({
        id: uuidv4(),
        content,
        embedding,
      });
    }

    return {
      success: true,
      message: "Resume file embedded and stored successfully.",
    };
  } catch (err) {
    console.error("Embedding error:", err);
    return { success: false, error: err.message };
  }
}
