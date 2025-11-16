import ChatWindow from "./components/ChatWindow";
import CampaignForm from "./components/CampaignForm";
import { ChatProvider } from "./store/chat";

export default function App() {
  return (
    <ChatProvider>
      <div className="mx-auto max-w-6xl min-h-screen grid grid-rows-[auto_1fr] gap-4 p-4 text-zinc-50">
        {/* barra superior que no llega a ser navbar */}
        <header className="flex items-center justify-between px-5 py-3 border rounded-2xl border-red-200/40 bg-zinc-950/50 backdrop-blur">
          <div>
            <p className="text-xs tracking-[0.2em] text-red-200/80">
          parkG-ing
            </p>
            <h1 className="text-2xl font-semibold text-white">
              Generador de Campañas MCP SAC
            </h1>
          </div>
        </header>

        {/* Main grid */}
        <main className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <section className="min-h-0 rounded-3xl border border-red-200/30 bg-zinc-950/60 shadow-[0px_20px_40px_rgba(0,0,0,0.45)] backdrop-blur">
            <ChatWindow />
          </section>
          <aside className="min-h-0 space-y-4">
            <CampaignForm />
          </aside>
        </main>
      </div>
    </ChatProvider>
  );
}
