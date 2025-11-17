import { useCallback, useEffect, useState } from "react";
import { getCampaigns } from "../api/clients";
import type { CampaignRecord } from "../types";

function formatDate(value?: string) {
  if (!value) return "Fecha desconocida";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getCampaigns();
      setCampaigns(items);
      if (items.every((item) => item.id !== openId)) {
        setOpenId(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos recuperar las campañas."
      );
    } finally {
      setLoading(false);
    }
  }, [openId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="space-y-4 rounded-3xl border border-red-200/30 bg-zinc-950/70 p-5 shadow-[0px_20px_45px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
            Historial
          </p>
          <h3 className="text-xl font-semibold text-white">
            Campañas guardadas
          </h3>
          <p className="text-sm text-zinc-400">
            Expandí una campaña para ver todo lo generado por el agente.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-xl border border-red-200/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:border-red-200/60 disabled:opacity-50"
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-red-100">
          {error}
        </p>
      )}

      {!error && !loading && campaigns.length === 0 && (
        <p className="rounded-2xl border border-zinc-500/20 bg-zinc-900/40 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-200">
          Aún no hay campañas.
        </p>
      )}

      <div className="space-y-2">
        {campaigns.map((campaign) => {
          const isOpen = openId === campaign.id;
          const toggle = () =>
            setOpenId((current) =>
              current === campaign.id ? null : campaign.id
            );
          const result = campaign.result;
          return (
            <div
              key={campaign.id}
              className="border rounded-2xl border-red-200/20 bg-zinc-900/40"
            >
              <button
                type="button"
                onClick={toggle}
                className="flex items-center justify-between w-full gap-4 px-4 py-3 text-sm text-left text-white"
              >
                <div>
                  <p className="font-semibold">{campaign.producto}</p>
                  <p className="text-xs text-zinc-400">
                    {campaign.publico_objetivo} —{" "}
                    {campaign.status.toUpperCase()}
                  </p>
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.3em] transition ${
                    isOpen ? "text-red-200" : "text-zinc-500"
                  }`}
                >
                  {isOpen ? "Cerrar" : "Ver"}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 py-4 space-y-3 text-sm border-t border-red-200/10 text-zinc-200">
                  <p className="text-xs text-zinc-400">
                    Creada: {formatDate(campaign.created_at)}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Última actualización: {formatDate(campaign.updated_at)}
                  </p>

                  {result ? (
                    <>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
                          Tweets
                        </p>
                        {result.tweets?.length ? (
                          <ol className="mt-1 space-y-2 list-decimal list-inside">
                            {result.tweets.map((tweet, idx) => (
                              <li key={idx} className="whitespace-pre-wrap">
                                {tweet}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-xs text-zinc-400">Sin tweets.</p>
                        )}
                      </div>
                      {result.linkedin_post && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
                            LinkedIn
                          </p>
                          <p className="whitespace-pre-wrap">
                            {result.linkedin_post}
                          </p>
                        </div>
                      )}
                      {result.instagram_post && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
                            Instagram
                          </p>
                          <p className="whitespace-pre-wrap">
                            {result.instagram_post}
                          </p>
                        </div>
                      )}
                      {result.resumen && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">
                            Resumen del agente
                          </p>
                          <p className="whitespace-pre-wrap">
                            {result.resumen}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-zinc-400">
                      Resultados todavía no disponibles para esta campaña.
                    </p>
                  )}

                  {campaign.error && (
                    <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-red-100">
                      Error: {campaign.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
