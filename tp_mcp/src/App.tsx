import ChatWindow from "./components/ChatWindow";
import CampaignForm from "./components/CampaignForm";
import CampaignResults from "./components/CampaignResults";
import CampaignHistory from "./components/CampaignHistory";
import { ChatProvider } from "./store/chat";
import { useState } from "react";

export default function App() {
  const [handdleOpenMenu, setHandleOpenMenu] = useState(false);
  return (
    <ChatProvider>
      <div className="mx-auto max-w-6xl min-h-screen gap-4 p-4 text-zinc-50">
        {/* barra superior que no llega a ser navbar */}
        <header className="flex items-center justify-between px-5 py-3 border rounded-2xl border-red-200/40 bg-zinc-950/50 backdrop-blur">
          <div>
            <section className="absolute hidden lg:relative lg:block">
              <button onClick={() => setHandleOpenMenu(!handdleOpenMenu)}>
                Open Menu
              </button>
            </section>
            <p className="text-xs tracking-[0.2em] text-red-200/80">
              parkG-ing
            </p>
            <h1 className="text-2xl font-semibold text-white">
              Generador de Campañas MCP SAC
            </h1>
          </div>
        </header>

        {/* Main grid */}
        {handdleOpenMenu === false ? null : (
          <section>
            <CampaignHistory />
          </section>
        )}
        <main className="grid gap-6 mt-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="space-y-4">
            <CampaignForm />
          </section>
          <section>
            <CampaignResults />
          </section>
        </main>
      </div>
    </ChatProvider>
  );
}
