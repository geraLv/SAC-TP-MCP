import { useState } from "react";

export default function CampaignForm() {
  const [producto, setProducto] = useState("");
  const [publico, setPublico] = useState("");

  return (
    <section className="space-y-4 rounded-3xl border border-red-200/30 bg-zinc-950/70 p-5 shadow-[0px_20px_45px_rgba(0,0,0,0.45)] backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
          AI EXPRESS
        </p>
        <h3 className="text-xl font-semibold text-white">Crear campaña</h3>
        <p className="text-sm text-zinc-400">
          maqueta tus ideas acá: completá los campos y guarda tu inspiración.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.2em] text-red-100/80">
          Producto o servicio
        </span>
        <input
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="Ej: Venta de productos antiguos"
          className="w-full px-4 py-3 text-sm text-white transition border outline-none rounded-2xl border-red-200/30 bg-white/5 placeholder:text-zinc-500 focus:border-red-400/70 focus:bg-white/10"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.2em] text-red-100/80">
          Público objetivo
        </span>
        <input
          value={publico}
          onChange={(e) => setPublico(e.target.value)}
          placeholder="Ej: Coleccionistas/Exóticos"
          className="w-full px-4 py-3 text-sm text-white transition border outline-none rounded-2xl border-red-200/30 bg-white/5 placeholder:text-zinc-500 focus:border-red-400/70 focus:bg-white/10"
        />
      </label>

      <button
        type="button"
        className="w-full rounded-2xl border border-transparent bg-linear-to-r bg-red-700/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-900/30 transition hover:from-red-800 hover:to-red-700"
      >
        Guardar idea (no anda)
      </button>
    </section>
  );
}
