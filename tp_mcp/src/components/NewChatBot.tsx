import React from "react";

type Props = { onClick: () => void; disabled?: boolean };
export default function NewChatButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-2 text-sm"
    >
      🧹 Nuevo chat
    </button>
  );
}
