import { useEffect, useMemo, useState } from "react";
import { createCampaign, getLatestCampaign } from "../api/clients";
import type { CampaignRecord } from "../types";
// @ts-ignore: no type definitions for './Spotlight'
import { Spotlight } from "./Spotlight";

type Feedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | { type: "info"; message: string }
  | null;

type CampaignFormProps = {
  onSubmitted?: () => void;
};

export default function CampaignForm({ onSubmitted }: CampaignFormProps) {
  const [producto, setProducto] = useState("");
  const [publico, setPublico] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [lastCampaign, setLastCampaign] = useState<CampaignRecord | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const latest = await getLatestCampaign();
        if (!active) return;

        if (latest) {
          setLastCampaign(latest);
          setProducto(latest.producto ?? "");
          setPublico(latest.publico_objetivo ?? "");
          setFeedback({
            type: "info",
            message:
              "Ultima campana recuperada. Podes reutilizarla o crear una nueva.",
          });
        } else {
          setFeedback({
            type: "info",
            message: "Guarda tu primera campana para que el agente la use.",
          });
        }
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "No pudimos leer los datos actuales.",
        });
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const buttonDisabled = saving || loading;

  const feedbackClasses = useMemo(() => {
    if (!feedback) return "";
    switch (feedback.type) {
      case "success":
        return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
      case "error":
        return "border-red-400/60 bg-red-500/10 text-red-100";
      default:
        return "border-zinc-500/30 bg-zinc-600/10 text-zinc-100";
    }
  }, [feedback]);

  const handleSave = async () => {
    if (!producto.trim() || !publico.trim()) {
      setFeedback({
        type: "error",
        message: "Completa los campos antes de guardar.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const record = await createCampaign({
        producto: producto.trim(),
        publico_objetivo: publico.trim(),
      });

      setLastCampaign(record);
      setFeedback({
        type: "success",
        message:
          "Campana enviada. En breve veras el resultado en el panel inferior.",
      });
      onSubmitted?.();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "No pudimos guardar la campana.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spotlight
      className="border border-red-200/30 bg-zinc-950/70 p-5 shadow-[0px_20px_45px_rgba(0,0,0,0.45)] backdrop-blur"
      spotlightColor="rgba(255, 0, 72, 0.22)"
    >
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
            AI EXPRESS
          </p>
          <h3 className="text-xl font-semibold text-white">Crear campana</h3>
          <p className="text-sm text-zinc-400">
            Define el producto y tu publico objetivo; el servicio lo enviara al
            agente y guardara todo en MongoDB.
          </p>
        </div>

        {lastCampaign && (
          <p className="rounded-2xl border border-zinc-500/30 bg-zinc-900/50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-100">
            Ultimo estado: {lastCampaign.status.toUpperCase()}
          </p>
        )}

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-red-100/80">
            Producto o servicio
          </span>
          <input
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            placeholder="Ej: Venta de productos antiguos"
            className="w-full px-4 py-3 text-sm text-white transition border outline-none rounded-2xl border-red-200/30 bg-white/5 placeholder:text-zinc-500 focus:border-red-400/70 focus:bg-white/10"
            disabled={loading}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-red-100/80">
            Publico objetivo
          </span>
          <input
            value={publico}
            onChange={(e) => setPublico(e.target.value)}
            placeholder="Ej: Coleccionistas/Exoticos"
            className="w-full px-4 py-3 text-sm text-white transition border outline-none rounded-2xl border-red-200/30 bg-white/5 placeholder:text-zinc-500 focus:border-red-400/70 focus:bg-white/10"
            disabled={loading}
          />
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={buttonDisabled}
          className={`w-full rounded-2xl border bg-linear-to-r cursor-pointer border-red-400/60 bg-zinc-950/70 hover:bg-red-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:shadow-lg hover:shadow-red-900/30 transition ${
            buttonDisabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Guardando..." : "Enviar campana"}
        </button>

        {feedback && (
          <p
            className={`rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.2em] ${feedbackClasses}`}
            role={feedback.type === "error" ? "alert" : undefined}
          >
            {feedback.message}
          </p>
        )}
      </section>
    </Spotlight>
  );
}
