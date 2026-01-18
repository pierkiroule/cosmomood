const EMOJIS = ["✨","🪐","🌊","🧿","🍀","🔥","💎","🌈","🌪️","🍄","🌸","🌑","⚡","🧊","🧬"];

export default function EmojiPicker({ onAdd }) {
  return (
    <div style={{
      position: "absolute",
      bottom: 90,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        padding: "10px 14px",
        background: "rgba(0,0,0,0.35)",
        borderRadius: 20
      }}>
        {EMOJIS.map(e => (
          <button
            key={e}
            onClick={() => onAdd(e)}
            style={{
              fontSize: 24,
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
