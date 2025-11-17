import CampaignForm from "./components/CampaignForm";
import CampaignResults from "./components/CampaignResults";
import { ChatProvider } from "./store/chat";
// @ts-ignore: no type definitions for './components/LaserFlow'
import { LaserFlow } from "./components/LaserFlow"

export default function App() {
  return (
    <ChatProvider>
      <div className="relative min-h-screen overflow-visible">
        <div className="flex items-start max-w-6xl min-h-screen mx-auto">
          <div className="relative w-full">
            <div
              className="absolute z-0 w-full -translate-x-1/2 pointer-events-none left-1/2"
              style={{ top: -92 }}
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
            <div
              className="relative z-10 w-full p-4 mx-auto border mt-[140px] bg-zinc-950/60 border-red-200/40 rounded-4xl"
              
            >
              <div className="max-w-6xl mx-auto text-zinc-50">
                {/* barra superior que no llega a ser navbar */}
                <header className="flex items-center justify-between px-5 py-3 border rounded-2xl border-red-200/40 bg-950/50 backdrop-blur">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-red-200/80">
                      Smart ZER0
                    </p>
                    <h1 className="text-2xl font-semibold text-white">
                      Generador de Campañas MCP SAC
                    </h1>
                  </div>
                </header>

                {/* Main grid */}
                <main className="relative gap-6 mt-6">
                  <div className="flex flex-row gap-6 ">
                    <CampaignForm />
                    <CampaignResults />
                  </div>
                </main>
              </div>
            </div>

          </div> {/* end relative container */}

        </div> {/* end centered container */}
      </div> {/* end root */}
    </ChatProvider>
  );
}
