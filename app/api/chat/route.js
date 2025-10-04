import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
let chat;

async function getResumeText() {
  // Fetch the file (assuming you store it in Supabase storage bucket "resumes")
  const { data, error } = await supabase
    .storage
    .from("project-images")
    .download("/resume/Armaan-Resume.txt"); // change to your actual file path

  if (error) {
    console.error("Error fetching resume:", error.message);
    return "";
  }

  // Convert blob/stream → text
  const text = await data.text();
  return text;
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

    // Step 1: Get full resume text (instead of embeddings)
    const resumeText = await getResumeText();

    // Step 2: Create enhanced prompt
    const newPrompt = `
You are <strong>Mohammad Armaan</strong>'s personal chatbot for his portfolio website.
- If the user asks anything about <strong>Mohammad Armaan</strong>'s professional questions, then answer from the below resume (context).
- Respond in **HTML format** with proper use of tags like <h3>, <h4>, <h5>, <strong>, <ul>, <li>, <p>, etc.
- Do not forget to highlight the headings. 
- Use Font JetBrains_Mono
- Also apply stylings such as padding, margins, spacing. For Link color apply this colour oklch(0.723 0.219 149.579).
- Do not apply any other styling for texts or headings.
- Always remember to make my name bold like <strong>Mohammad Armaan</strong>.
- The links should have target="_blank" so they open in a new tab.
- Appreciate the user if they thank you.
- Don't answer any other questions unrelated to <strong>Mohammad Armaan</strong>.

Relevant Resume Info:
${resumeText}

Question: ${prompt}
`;

    // Step 3: Initialize chat if not already
    if (!chat) {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
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
