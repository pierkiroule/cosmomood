import { useMemo, useState, useEffect } from "react";
import ThreeScene from "./three/ThreeScene";
import Header from "./ui/Header";
import BottomPanel from "./ui/BottomPanel";
import PairComparison from "./ui/PairComparison";

import { EMOJI_MOODS } from "./data/emojiMoods";
import { buildMoodGraph } from "./state/buildMoodGraph";
import { useMoodSelection } from "./state/useMoodSelection";

const MIN_SELECTION = 3;

export default function App() {
  const [mode, setMode] = useState("POSE");
  const [step, setStep] = useState("SELECT");
  const [comparisonIndex, setComparisonIndex] = useState(0);

  const {
    selectedEmojis,
    toggleEmoji,
    pairs,
    recordComparison,
    occurrenceScore,
    cooccurrenceMatrix,
    dominantStatus,
    setDominant,
    resetSelection
  } = useMoodSelection();

  useEffect(() => {
    setComparisonIndex(0);
  }, [pairs]);

  const graph = useMemo(() => {
    return buildMoodGraph({
      selectedEmojis,
      occurrenceScore,
      cooccurrenceMatrix
    });
  }, [selectedEmojis, occurrenceScore, cooccurrenceMatrix]);

  const currentPair = pairs[comparisonIndex];
  const hasNextPair = comparisonIndex < pairs.length - 1;

  const handlePairSelect = (winner) => {
    if (!currentPair) return;
    const [a, b] = currentPair;
    recordComparison({ a, b, winner });

    if (hasNextPair) {
      setComparisonIndex(index => index + 1);
    } else {
      setStep("GRAPH");
    }
  };

  const startComparisons = () => {
    if (selectedEmojis.length < 2) return;
    setStep("COMPARE");
  };

  const restartFlow = () => {
    resetSelection();
    setComparisonIndex(0);
    setStep("SELECT");
  };

  return (
    <div className="app">
      {step === "GRAPH" && graph.nodes.length > 0 && (
        <ThreeScene nodes={graph.nodes} mode={mode} />
      )}

      <Header />

      <div className="app__panel">
        {step === "SELECT" && (
          <section className="mood-step">
            <h2 className="mood-step__title">Choisis les émojis qui résonnent.</h2>
            <p className="mood-step__subtitle">
              Sélection libre, sans ordre. Idéalement {MIN_SELECTION} à 6.
            </p>
            <div className="emoji-grid">
              {EMOJI_MOODS.map(({ id, label }) => {
                const isSelected = selectedEmojis.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleEmoji(id)}
                    className={`emoji-grid__item${isSelected ? " emoji-grid__item--selected" : ""}`}
                  >
                    <span className="emoji-grid__emoji">{id}</span>
                    <span className="emoji-grid__label">{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mood-step__actions">
              <button
                type="button"
                className="primary-button"
                disabled={selectedEmojis.length < 2}
                onClick={startComparisons}
              >
                Comparer les choix
              </button>
            </div>
            <div className="mood-step__selected">
              {selectedEmojis.length === 0
                ? "Aucun emoji sélectionné pour l’instant."
                : selectedEmojis.join(" ")}
            </div>
          </section>
        )}

        {step === "COMPARE" && (
          <section className="mood-step">
            <h2 className="mood-step__title">Quel emoji résonne le plus maintenant ?</h2>
            <p className="mood-step__subtitle">
              Duel {comparisonIndex + 1} sur {pairs.length || 1}.
            </p>
            <PairComparison
              pair={currentPair}
              onSelect={handlePairSelect}
              disabled={!currentPair}
            />
            <div className="mood-step__actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setStep("SELECT")}
              >
                Modifier la sélection
              </button>
            </div>
          </section>
        )}

        {step === "GRAPH" && (
          <section className="mood-step">
            <h2 className="mood-step__title">Graphe du mood du moment</h2>
            <p className="mood-step__subtitle">
              Dominance et co-occurrences issues de tes choix.
            </p>
            {dominantStatus.isTie && (
              <div className="tie-breaker">
                <p className="tie-breaker__prompt">
                  Si tu devais en garder un seul, là maintenant ?
                </p>
                <div className="tie-breaker__choices">
                  {dominantStatus.tied.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className="tie-breaker__choice"
                      onClick={() => setDominant(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mood-step__actions">
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setMode(current => (current === "RESONANCE" ? "POSE" : "RESONANCE"))
                }
              >
                {mode === "RESONANCE" ? "Pause" : "Animer"}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={restartFlow}
              >
                Recommencer
              </button>
            </div>
          </section>
        )}
      </div>

      <BottomPanel
        canResonate={step === "GRAPH"}
        mode={mode}
        onResonate={() =>
          setMode(current => (current === "RESONANCE" ? "POSE" : "RESONANCE"))
        }
      />
    </div>
  );
}
