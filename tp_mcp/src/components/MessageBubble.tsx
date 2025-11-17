import { type Message } from "../types";

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const timestamp = new Date(msg.ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-3xl border px-4 py-3 text-sm shadow-lg shadow-black/40 backdrop-blur ${
          isUser
            ? "rounded-br-md border-red-200/40 bg-gradient-to-br from-red-600/80 to-red-500/70 text-white"
            : "rounded-bl-md border-white/10 bg-white/5 text-zinc-100"
        }`}
        title={new Date(msg.ts).toLocaleString()}
      >
        <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-red-100/80">
          <span>{isUser ? "Vos/Nombre" : "Asistente"}</span>
          <span className="text-[0.6rem] tracking-[0.15em] text-white/60">
            {timestamp}
          </span>
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">
          {msg.content}
        </div>
      </div>
    </div>
  );
}
