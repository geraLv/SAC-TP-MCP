import React from "react";
import ChatWindow from "./components/ChatWindow";
import CampaignForm from "./components/CampaignForm";

export default function App() {
  return (
    <div className="mx-auto max-w-5xl h-screen grid grid-rows-[auto_1fr]">
      {/* Top bar */}
      <header className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-lg font-semibold">Generador de Campañas</h1>
      </header>

      {/* Main grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3">
        <section className="lg:col-span-2 min-h-0 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <ChatWindow />
        </section>
        <aside className="min-h-0 space-y-3">
          <CampaignForm />
        </aside>
      </main>
    </div>
  );
}
