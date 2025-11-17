type Props = { onClick: () => void; disabled?: boolean };
export default function NewChatButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-red-100/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:border-red-100/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-zinc-500"
    >
      Nuevo chat
    </button>
  );
}
