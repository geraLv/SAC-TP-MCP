import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chat";
import MessageBubble from "./MessageBubble";
import NewChatButton from "./NewChatBot";

export default function ChatWindow() {
  const { state, send, reset } = useChatStore();
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [state.messages.length]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.pending) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-3">
        <h1 className="text-base font-semibold">
          Generador de Campañas — Chat
        </h1>
        <NewChatButton onClick={reset} disabled={state.pending} />
      </div>

      {/* Historial */}
      <div
        ref={scroller}
        className="flex-1 overflow-auto p-3 space-y-2 bg-white dark:bg-zinc-900"
      >
        {state.messages.length === 0 && (
          <div className="text-sm text-zinc-500">
            Escribe un mensaje o usa el formulario de campaña.
          </div>
        )}
        {state.messages.map((m: any) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      {/* Error */}
      {state.error && (
        <div className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 text-sm px-3 py-2">
          {state.error}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex gap-2 p-3 border-t border-zinc-200 dark:border-zinc-800"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={state.pending}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
