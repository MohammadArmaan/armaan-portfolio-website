"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { BotMessageSquare, Send } from "lucide-react";

import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

export default function ChatBot() {
    const [prompt, setPrompt] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleChat(e) {
        e.preventDefault();
        if (!prompt) return;

        // Add user's message first
        setChatLog((prev) => [...prev, { from: "user", text: prompt }]);
        setPrompt(""); // clear input

        setIsLoading(true);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();

        // Then add Gemini's response
        setChatLog((prev) => [
            ...prev,
            { from: "gemini", text: data.response },
        ]);

        setIsLoading(false);
    }
    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={() => setIsModalOpen((prev) => !prev)}
        >
            <DialogTrigger>
            <div className="p-5 rounded-full bg-primary text-dark-background cursor-pointer fixed right-10 bottom-20 z-50 hover:scale-105 transition-all">
                    <BotMessageSquare className="text-4xl" />
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-lg w-[95vw] h-[90vh] flex flex-col overflow-hidden">
  <DialogHeader className="p-4 border-b">
    <DialogTitle className="text-lg text-center">
      Talk to Mohammad Armaan's Bot 🤖
    </DialogTitle>
    <DialogDescription className="text-center text-muted-foreground">
      Ask anything about Mohammad Armaan
    </DialogDescription>
  </DialogHeader>

  {/* Scrollable chat area */}
  <div className="flex-1 overflow-y-auto px-4 py-2">
    <div className="flex flex-col gap-4">
      {chatLog.map((msg, index) =>
        msg.from === "gemini" ? (
          <div
            key={index}
            className="self-start bg-muted text-foreground sm:max-w-[400px] max-w-[250px] px-4 py-2 rounded-md text-sm break-words [&_a]:text-primary [&_a:hover]:underline"
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ) : (
          <div
            key={index}
            className="self-end bg-primary text-dark-background max-w-full px-4 py-2 rounded-md text-sm break-words"
          >
            {msg.text}
          </div>
        )
      )}
      {isLoading && (
        <div className="self-start bg-muted text-foreground max-w-fit px-4 py-2 rounded-md text-sm">
          <span className="animate-pulse text-xl">...</span>
        </div>
      )}
    </div>
  </div>

  {/* Input stays fixed at bottom */}
  <form
    onSubmit={handleChat}
    className="p-4 border-t flex items-center gap-2"
  >
    <Input
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Ask something..."
      className="flex-1 rounded-full"
    />
    <Button type="submit" disabled={isLoading}>
      <Send size={20} />
    </Button>
  </form>
</DialogContent>

        </Dialog>
    );
}
