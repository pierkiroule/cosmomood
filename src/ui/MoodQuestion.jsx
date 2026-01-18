export default function MoodQuestion({ question, onChoose }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }}>
      <p style={{ fontSize: 18, marginBottom: 40 }}>
        {question.prompt}
      </p>

      <div style={{ display: "flex", gap: 80 }}>
        <button
          onClick={() => onChoose(question.left)}
          style={{ fontSize: 48 }}
        >
          {question.left.emoji}
        </button>

        <button
          onClick={() => onChoose(question.right)}
          style={{ fontSize: 48 }}
        >
          {question.right.emoji}
        </button>
      </div>
    </div>
  );
}
