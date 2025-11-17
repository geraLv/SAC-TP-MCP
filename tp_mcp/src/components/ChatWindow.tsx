import { useEffect, useRef, useState, type FormEvent } from "react";
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.pending) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-red-300/20 bg-red-900/5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
            Conversación
          </p>
          <h2 className="text-lg font-semibold text-white">
            Generador de Campañas — Chat
          </h2>
        </div>
        <NewChatButton onClick={reset} disabled={state.pending} />
      </div>

      {/* Historial pues */}
      <div
        ref={scroller}
        className="flex-1 px-5 py-4 space-y-2 overflow-auto bg-linear-to-b from-zinc-900/30 via-transparent to-zinc-900/30"
      >
        {state.messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      {/* Error */}
      {state.error && (
        <div className="px-5 py-3 text-sm text-red-100 bg-red-900/40">
          {state.error}
        </div>
      )}

      {/* Input para poner el textito */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 px-5 py-4 border-t border-red-300/10 bg-zinc-950/40"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Comparte indicaciones, tono u objetivos…"
            className="flex-1 px-4 py-3 text-sm text-white transition border outline-none rounded-2xl border-red-200/30 bg-white/5 placeholder:text-zinc-500 focus:border-red-400/70 focus:bg-white/10"
          />
          <button
            type="submit"
            disabled={state.pending}
            className="px-5 py-3 text-sm font-semibold tracking-wide text-white uppercase transition border border-transparent cursor-pointer rounded-2xl bg-red-600/80 hover:bg-red-700/80"
          >
            Enviar
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-red-100/70">
          {state.pending ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
              Generando propuesta…
            </span>
          ) : (
            <span></span>
          )}
          <span className="text-zinc-500">
            {state.messages.length} mensaje{state.messages.length === 1 ? "" : "s"}
          </span>
        </div>
      </form>
    </div>
  );
}
