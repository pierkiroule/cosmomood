export default function MoodInvite() {
  return (
    <div style={{
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      maxWidth: 340,
      opacity: 0.9,
      pointerEvents: "none"
    }}>
      <p style={{ fontSize: 16, lineHeight: 1.45 }}>
        Choisis les symboles qui décrivent<br />
        ton <b>mood du moment</b>.<br /><br />
        Puis observe comment il entre<br />
        en résonance avec le mood collectif.
      </p>
    </div>
  );
}
