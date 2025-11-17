import { useState } from "react";
import CampaignForm from "./components/CampaignForm";
import CampaignResults from "./components/CampaignResults";
import CampaignHistory from "./components/CampaignHistory";
import { ChatProvider } from "./store/chat";
// @ts-ignore: no type definitions for './components/LaserFlow'
import { LaserFlow } from "./components/LaserFlow";

export default function App() {
  const [handdleOpenMenu, setHandleOpenMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);
  const [waitingResults, setWaitingResults] = useState(false);

  const toggleMode = () => {
    if (waitingResults) return;
    setShowForm((prev) => !prev);
  };

  const handleCampaignSubmitted = () => {
    setShowForm(false);
    setWaitingResults(true);
    setResultsRefreshKey((key) => key + 1);
  };

  const handleResultsLoaded = () => {
    setWaitingResults(false);
  };

  return (
    <ChatProvider>
      <div className="relative min-h-screen overflow-visible">
        <div className="flex items-start max-w-6xl min-h-screen mx-auto">
          <div className="relative w-full">
            <div
              className="absolute z-0 w-full -translate-x-1/2 pointer-events-none left-1/2"
              style={{ top: -70 }}
            >
              <div className="w-full transform -translate-y-12">
                <LaserFlow
                  horizontalBeamOffset={0.2}
                  verticalBeamOffset={0.0}
                  color="#FF2D55"
                />
              </div>
            </div>

            {/* Panel principal */}
            <div className="relative z-10 w-full p-4 mx-auto mt-40 mb-8 border bg-zinc-950/60 border-red-200/40 rounded-4xl">
              <div className="max-w-6xl mx-auto text-zinc-50">
                {/* barra superior que no llega a ser navbar */}
                <header className="flex items-center justify-between px-5 py-3 border rounded-3xl border-red-200/40 bg-zinc-950/50 backdrop-blur">
                  <div>
                    <section className="absolute hidden lg:relative lg:block">
                      <button
                        className="px-3 cursor-pointer py-1.5 text-sm border rounded-2xl border-red-400/60 bg-zinc-950/70 hover:bg-red-500/10"
                        onClick={() => setHandleOpenMenu(!handdleOpenMenu)}
                      >
                        Abrir Menu +
                      </button>
                    </section>
                    <p className="text-xs mt-2 tracking-[0.2em] text-red-200/80">
                      Smart ZER0
                    </p>
                    <h1 className="text-2xl font-semibold text-white">
                      Generador de Campañas MCP SAC
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={waitingResults}
                    className="rounded-2xl border border-red-400/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showForm ? "Ver resultados" : "Nueva campana"}
                  </button>
                </header>

                {/* Main grid */}
                {handdleOpenMenu === false ? null : (
                  <section className="mt-4">
                    <CampaignHistory />
                  </section>
                )}

                {/* Main grid */}
                <main className="relative mt-6">
                  {showForm ? (
                    <CampaignForm onSubmitted={handleCampaignSubmitted} />
                  ) : (
                    <CampaignResults
                      refreshToken={resultsRefreshKey}
                      forceLoading={waitingResults}
                      onLoaded={handleResultsLoaded}
                    />
                  )}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
