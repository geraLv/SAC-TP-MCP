import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { ChatState, Role } from "../types";

const uid = () => Math.random().toString(36).slice(2);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const OFFLINE_MSG = "No tengo backend :,v — por ahora nomás estoy de adorno y espero una mejora visual de Naza moderfokin mr framer fokim moushon así onda no se re largo el msj, sos re capo naza ❤️";

type ChatContextValue = {
  state: ChatState;
  send: (userText: string) => Promise<void>;
  reset: () => void;
  pushLocal: (role: Role, content: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<ChatState>;
}) {
  const [state, setState] = useState<ChatState>({
    messages: initial?.messages ?? [],
    pending: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ messages: [], pending: false, error: null });
  }, []);

  const pushLocal = useCallback((role: Role, content: string) => {
    setState((s) => ({
      ...s,
      messages: [...s.messages, { id: uid(), role, content, ts: Date.now() }],
    }));
  }, []);

  const send = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    setState((s) => ({
      ...s,
      pending: true,
      error: null,
      messages: s.messages.concat({
        id: uid(),
        role: "user",
        content: trimmed,
        ts: Date.now(),
      }),
    }));

    await wait(500);

    setState((s) => ({
      ...s,
      pending: false,
      messages: s.messages.concat({
        id: uid(),
        role: "assistant",
        content: OFFLINE_MSG,
        ts: Date.now(),
      }),
    }));
  }, []);

  return (
    <ChatContext.Provider value={{ state, send, reset, pushLocal }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatStore debe usarse dentro de <ChatProvider />");
  }
  return ctx;
}
