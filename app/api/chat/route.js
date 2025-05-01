import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
let chat;

async function getRelevantContext(prompt) {
    const embedder = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001",
        apiKey: process.env.GOOGLE_API_KEY,
    });

    const embedding = await embedder.embedQuery(prompt);

    const { data, error } = await supabase.rpc("match_resume_chunks", {
        query_embedding: embedding,
        match_count: 3,
    });

    if (error) {
        console.error("Similarity search error:", error.message);
        return "";
    }

    return data.map((d) => d.content).join("\n\n");
}

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "No prompt provided" },
                { status: 400 }
            );
        }

        // Step 1: Get relevant context from embeddings
        const similarContext = await getRelevantContext(prompt);

        // Step 2: Create enhanced prompt
        const newPrompt = `
You are Mohammad Armaan's personal chatbot for his portfolio website.
- If the user aks anything about Mohammad Armaan's professional questions, then aswer from the below resume(context)
- Respond in **HTML format** with proper use of tags like <h3>, <h4>, <h5> <strong>, <ul>, <li>, <p>, etc. Do not forget to highlight the headings. 
- Use Font JetBrains_Mono
- Also apply stylings such as padding, margins, spacing. For Link color apply this colour oklch(0.723 0.219 149.579).
- Do not appy any other styling for texts or headings
- Always remeber to make my name bold like <strong>Mohammad Armaan</strong>
- The links should have target="_blank" propery so that it opens in differnt tabs
- Appreciate the user after if they thank you
- Don't answer any other answers other than Mohammad Armaan's related questions

Relevant Movie Info: 
${similarContext}

Question: ${prompt}
`;

        // Step 3: Initialize chat if not already
        if (!chat) {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

            chat = model.startChat({
                history: [],
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 1000,
                },
            });
        }

        const result = await chat.sendMessage(newPrompt);
        let response = await result.response.text();

        response = response
            .replace(/```html\s*|```/g, "") // Remove ```html and ```
            .trim();

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Gemini error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
