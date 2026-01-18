export default function MoodMirror({ metrics }) {
  const { density, centrality } = metrics;

  let phrase =
    "Ton mood entre en contact avec une dynamique plus large.";

  if (density < 0.3 && centrality < 0.4)
    phrase =
      "Un mood discret, qui rencontre un monde plus agité que lui.";

  if (density >= 0.3 && density < 0.6)
    phrase =
      "Ton mood s’accorde partiellement avec le mouvement collectif.";

  if (density >= 0.6 && centrality < 0.5)
    phrase =
      "Une intensité personnelle qui cherche sa place dans le collectif.";

  if (density >= 0.6 && centrality >= 0.6)
    phrase =
      "Ton mood est fortement aligné avec une tension collective du moment.";

  return (
    <div style={{
      position: "absolute",
      top: 90,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.5)",
      padding: "14px 20px",
      borderRadius: 18,
      maxWidth: 360,
      textAlign: "center",
      fontSize: 14
    }}>
      {phrase}
    </div>
  );
}
