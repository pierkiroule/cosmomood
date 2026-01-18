export default function PairComparison({ pair, onSelect, disabled = false }) {
  if (!pair || pair.length !== 2) return null;
  const [left, right] = pair;

  return (
    <div className="pair-comparison">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect?.(left)}
        className="pair-comparison__choice"
      >
        <span className="pair-comparison__emoji">{left}</span>
      </button>
      <span className="pair-comparison__vs">vs</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect?.(right)}
        className="pair-comparison__choice"
      >
        <span className="pair-comparison__emoji">{right}</span>
      </button>
    </div>
  );
}
