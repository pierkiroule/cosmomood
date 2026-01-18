export default function MiniDashboard({ metrics }) {
  return (
    <div style={{
      display: "flex",
      gap: 12,
      padding: 12
    }}>
      <Metric label="Charge" value={metrics.density} />
      <Metric label="Centre" value={metrics.centrality} />
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{
      flex: 1,
      background: "rgba(255,255,255,0.06)",
      borderRadius: 14,
      padding: 10
    }}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>
        {label}
      </div>
      <div style={{
        marginTop: 8,
        height: 8,
        background: "rgba(255,255,255,0.15)",
        borderRadius: 99
      }}>
        <div style={{
          height: "100%",
          width: `${Math.round(value * 100)}%`,
          background: "rgba(34,211,238,0.6)",
          borderRadius: 99
        }} />
      </div>
    </div>
  );
}
