export default function Header() {
  return (
    <div style={{
      position: "absolute",
      top: 24,
      left: 24,
      right: 24,
      pointerEvents: "none"
    }}>
      <h1 style={{
        margin: 0,
        letterSpacing: "0.25em",
        fontWeight: 300
      }}>
        COSMOMOOD
      </h1>
      <div style={{
        marginTop: 6,
        opacity: 0.7,
        fontSize: 14,
        maxWidth: 360
      }}>
        Faire résonner ton mood personnel<br />
        avec le mood collectif
      </div>
    </div>
  );
}
