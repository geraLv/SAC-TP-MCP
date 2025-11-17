import ChatWindow from "./components/ChatWindow";
import CampaignForm from "./components/CampaignForm";
import CampaignResults from "./components/CampaignResults";
import { ChatProvider } from "./store/chat";

export default function App() {
  return (
    <ChatProvider>
      <div className="mx-auto max-w-6xl min-h-screen gap-4 p-4 text-zinc-50">
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
        <main className="gpap-6 mt-6  ">
          <div className=" flex flex-row gap-6">
            <CampaignForm />
            <CampaignResults />
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}
