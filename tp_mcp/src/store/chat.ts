import { useState, useCallback } from "react";
import type {
  Message,
  ChatState,
  Role,
  ChatRequestBody,
  ChatResponse,
} from "../types";
import { postChat } from "../api/clients";

const uid = () => Math.random().toString(36).slice(2);

export function useChatStore(initial?: Partial<ChatState>) {
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

  const send = useCallback(
    async (
      userText: string,
      extra?: { producto?: string; publico?: string }
    ) => {
      setState((s) => ({ ...s, pending: true, error: null }));

      // 1) reflejar mensaje del usuario
      pushLocal("user", userText);

      // 2) construir payload para backend
      const body: ChatRequestBody = {
        messages: state.messages
          .concat([
            { id: uid(), role: "user", content: userText, ts: Date.now() },
          ])
          .map(({ role, content }) => ({ role, content })),
        producto: extra?.producto,
        publico: extra?.publico,
      };

      try {
        const res = await postChat(body);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = (await res.json()) as ChatResponse;
        setState((s) => ({
          ...s,
          pending: false,
          messages: s.messages.concat(data.messages ?? []),
        }));
      } catch (err: any) {
        setState((s) => ({
          ...s,
          pending: false,
          error: err?.message ?? "Error desconocido",
        }));
      }
    },
    [pushLocal, state.messages]
  );

  return { state, send, reset, pushLocal };
}
