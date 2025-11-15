import React, { useState } from "react";
import { useChatStore } from "../store/chat";

export default function CampaignForm() {
  const { send, state } = useChatStore();
  const [producto, setProducto] = useState("");
  const [publico, setPublico] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto.trim() || !publico.trim() || state.pending) return;
    const prompt = `Producto: ${producto}\nPúblico: ${publico}\nGenera 3 tweets, 1 post de LinkedIn profesional y 1 descripción de Instagram con emojis.`;
    send(prompt, { producto, publico });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3"
    >
      <div className="font-medium">Crear Campaña</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="Producto"
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
        />
        <input
          value={publico}
          onChange={(e) => setPublico(e.target.value)}
          placeholder="Público objetivo"
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={state.pending}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 disabled:opacity-50"
      >
        Generar y publicar (simulado)
      </button>
    </form>
  );
}
