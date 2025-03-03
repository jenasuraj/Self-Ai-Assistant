"use client";

import { useState } from "react";
import { sendToFastAPI } from "./utils/route";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);  // Array to store all questions & answers

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const userMessage = { question: inputText, answer: "..." };  // Placeholder until answer comes

    setChatHistory((prev) => [...prev, userMessage]);

    // Scroll to bottom after adding user message
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight, 
        behavior: 'smooth'
      });
    }, 100);  // Small delay to allow rendering

    const result = await sendToFastAPI(inputText);

    setChatHistory((prev) =>
      prev.map((item, index) =>
        index === prev.length - 1 ? { ...item, answer: result } : item
      )
    );

    setInputText("");

    // Scroll to bottom after getting AI response
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight, 
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold">OneAssistant🥷</h1>

      <div className="mt-4 p-4 bg-gray-100 rounded-md w-[60%] space-y-4">
        {chatHistory.length > 0 ? (
          <>
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-2">
                {/* User Message - Aligned Right */}
                <div className="flex justify-end">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-md max-w-[70%]">
                    <strong>User:</strong> {chat.question}
                  </div>
                </div>

                {/* AI Message - Aligned Left */}
                <div className="flex justify-start">
                  <div className="bg-green-100 text-green-800 p-2 rounded-md max-w-[70%]">
                    <strong>AI:</strong> {chat.answer}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 className="flex justify-center">Feel free to ask me anything </h1>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text..."
          className="border p-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </form>
    </div>
  );
}
