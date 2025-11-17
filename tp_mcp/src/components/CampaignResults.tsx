import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getLatestCampaign } from "../api/clients";
import type { CampaignRecord } from "../types";
// @ts-ignore: no type definitions for './Spotlight'
import { Spotlight } from "./Spotlight";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="p-4 space-y-2 border rounded-2xl border-red-100/10 bg-zinc-900/40">
      <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
        {title}
      </p>
      <div className="text-sm leading-relaxed text-zinc-100">{children}</div>
    </div>
  );
}

export default function CampaignResults() {
  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLatestCampaign("completed");
      setCampaign(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos traer los resultados generados."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const result = campaign?.result ?? null;
  const hasResults =
    !!result &&
    (result.tweets?.length ||
      result.linkedin_post ||
      result.instagram_post ||
      result.resumen);

  return (
    <Spotlight
      className="border border-red-200/30 bg-zinc-950/70 p-5 shadow-[0px_20px_45px_rgba(0,0,0,0.45)] backdrop-blur"
      spotlightColor="rgba(255, 0, 72, 0.22)"
    >
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
              SALIDA DEL AGENTE
            </p>
            <h3 className="text-xl font-semibold text-white">
              Última campaña generada
            </h3>
            <p className="text-sm text-zinc-400">
              Apenas termine el flujo en MCP, los posteos aparecerán acá.
            </p>
          </div>

          <button
            type="button"
            onClick={loadResults}
            disabled={loading}
            className="rounded-xl border border-red-200/20 cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:border-red-200/60 disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-red-100">
            {error}
          </p>
        )}

        {/* Nada generado aún */}
        {!error && !loading && !campaign && (
          <p className="rounded-2xl border border-zinc-500/20 bg-zinc-900/40 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-200">
            Todavía no se guardó ninguna campaña.
          </p>
        )}

        {/* Si hay campaña */}
        {campaign && (
          <div className="space-y-3">
            {/* CONTEXTO */}
            <Section title="Contexto">
              <ul className="space-y-1 text-zinc-200">
                <li>
                  <span className="font-semibold text-white">Producto:</span>{" "}
                  {campaign.producto}
                </li>
                <li>
                  <span className="font-semibold text-white">Público objetivo:</span>{" "}
                  {campaign.publico_objetivo}
                </li>
                <li>
                  <span className="font-semibold text-white">Estado:</span>{" "}
                  {campaign.status.toUpperCase()}
                </li>
                {campaign.updated_at && (
                  <li className="text-xs text-zinc-400">
                    Última actualización:{" "}
                    {new Date(campaign.updated_at).toLocaleString()}
                  </li>
                )}
              </ul>
            </Section>

            {/* Si no hay resultados */}
            {!hasResults && (
              <p className="rounded-2xl border border-zinc-500/20 bg-zinc-900/40 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-200">
                Estamos esperando los resultados del agente…
              </p>
            )}

            {/* HILO DE TWEETS */}
            {hasResults && result?.tweets?.length ? (
              <Section title="Hilo de tweets">
                <ol className="space-y-2 list-decimal list-inside text-zinc-100">
                  {result.tweets.map((tweet, idx) => (
                    <li key={idx} className="whitespace-pre-wrap">
                      {tweet}
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}

            {/* LINKEDIN */}
            {hasResults && result?.linkedin_post ? (
              <Section title="Post de LinkedIn">
                <p className="whitespace-pre-wrap">{result.linkedin_post}</p>
              </Section>
            ) : null}

            {/* INSTAGRAM */}
            {hasResults && result?.instagram_post ? (
              <Section title="Descripción de Instagram">
                <p className="whitespace-pre-wrap">{result.instagram_post}</p>
              </Section>
            ) : null}

            {/* RESUMEN */}
            {hasResults && result?.resumen ? (
              <Section title="Resumen del agente">
                <p className="whitespace-pre-wrap text-zinc-200">
                  {result.resumen}
                </p>
              </Section>
            ) : null}
          </div>
        )}
      </section>
    </Spotlight>
  );
}
