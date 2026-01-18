export default function MythReveal({ myth, onContinue }) {
  if (!myth) return null;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: 24
    }}>
      <h2>{myth.name}</h2>

      <div style={{ fontSize: 32, margin: "16px 0" }}>
        {myth.emojis.join(" ")}
      </div>

      <p style={{ maxWidth: 320, opacity: 0.8 }}>
        {myth.phrases[Math.floor(Math.random() * myth.phrases.length)]}
      </p>

      <button
        onClick={onContinue}
        style={{ marginTop: 32 }}
      >
        Faire résonner avec le CosmoMood
      </button>
    </div>
  );
}
