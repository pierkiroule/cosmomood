export default function BottomPanel({ canResonate, mode, onResonate }) {
  if (!canResonate) return null;

  return (
    <div style={{
      position: "absolute",
      bottom: 24,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center"
    }}>
      <button
        onClick={onResonate}
        style={{
          padding: "16px 28px",
          borderRadius: 999,
          fontSize: 16,
          background: mode === "RESONANCE"
            ? "rgba(255,255,255,0.12)"
            : "rgba(124,58,237,0.45)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "white",
          backdropFilter: "blur(8px)"
        }}
      >
        {mode === "RESONANCE"
          ? "Mettre en pause"
          : "Résonner avec le CosmoMood"}
      </button>
    </div>
  );
}
