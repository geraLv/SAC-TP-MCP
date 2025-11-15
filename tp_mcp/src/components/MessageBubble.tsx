import React from "react";
import { type Message } from "../types";

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-sm"
        }`}
        title={new Date(msg.ts).toLocaleString()}
      >
        {msg.content}
      </div>
    </div>
  );
}
