"use client";

import { useState } from "react";
import { sendToFastAPI } from "./utils/route";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const result = await sendToFastAPI(inputText);
    setInputText(' ')
    setResponse(result);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold">Chat with Your Math tutor🥷</h1>
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
      {response && (
        <p className="mt-4 p-4 bg-gray-100 rounded-md w-[60%] text-center">
          <strong>Response:</strong> {response}
        </p>
      )}
    </div>
  );
}
