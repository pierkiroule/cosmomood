import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cosmomood:mood-selection";
const MAX_COMPARISONS = 5;

const defaultState = {
  selectedEmojis: [],
  comparisons: [],
  dominantOverride: null
};

const loadState = () => {
  if (typeof window === "undefined") return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw);
    return {
      selectedEmojis: Array.isArray(parsed.selectedEmojis)
        ? parsed.selectedEmojis
        : [],
      comparisons: Array.isArray(parsed.comparisons)
        ? parsed.comparisons
        : [],
      dominantOverride: parsed.dominantOverride || null
    };
  } catch {
    return defaultState;
  }
};

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const generatePairs = (emojis, maxPairs = MAX_COMPARISONS) => {
  const pairs = [];
  for (let i = 0; i < emojis.length; i += 1) {
    for (let j = i + 1; j < emojis.length; j += 1) {
      pairs.push([emojis[i], emojis[j]]);
    }
  }
  return shuffle(pairs).slice(0, maxPairs);
};

export function useMoodSelection() {
  const [selectedEmojis, setSelectedEmojis] = useState(
    () => loadState().selectedEmojis
  );
  const [comparisons, setComparisons] = useState(
    () => loadState().comparisons
  );
  const [dominantOverride, setDominantOverride] = useState(
    () => loadState().dominantOverride
  );
  const [pairs, setPairs] = useState(() => generatePairs([]));

  useEffect(() => {
    setPairs(generatePairs(selectedEmojis));
    setComparisons([]);
    setDominantOverride(null);
  }, [selectedEmojis]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({
      selectedEmojis,
      comparisons,
      dominantOverride
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [selectedEmojis, comparisons, dominantOverride]);

  const toggleEmoji = (emoji) => {
    setSelectedEmojis(prev =>
      prev.includes(emoji)
        ? prev.filter(item => item !== emoji)
        : [...prev, emoji]
    );
  };

  const recordComparison = ({ a, b, winner }) => {
    if (!a || !b || !winner) return;
    setComparisons(prev => [...prev, { a, b, winner }]);
  };

  const occurrenceScore = useMemo(() => {
    const scores = {};
    comparisons.forEach(({ winner }) => {
      if (!winner) return;
      scores[winner] = (scores[winner] || 0) + 1;
    });
    return scores;
  }, [comparisons]);

  const cooccurrenceMatrix = useMemo(() => {
    const matrix = {};
    comparisons.forEach(({ a, b }) => {
      if (!a || !b) return;
      if (!matrix[a]) matrix[a] = {};
      if (!matrix[b]) matrix[b] = {};
      matrix[a][b] = (matrix[a][b] || 0) + 1;
      matrix[b][a] = (matrix[b][a] || 0) + 1;
    });
    return matrix;
  }, [comparisons]);

  const dominantStatus = useMemo(() => {
    if (!selectedEmojis.length) {
      return { dominant: null, isTie: false, tied: [] };
    }

    if (dominantOverride) {
      return { dominant: dominantOverride, isTie: false, tied: [] };
    }

    const maxScore = Math.max(
      ...selectedEmojis.map(emoji => occurrenceScore[emoji] || 0)
    );
    const topEmojis = selectedEmojis.filter(
      emoji => (occurrenceScore[emoji] || 0) === maxScore
    );

    if (topEmojis.length === 1) {
      return { dominant: topEmojis[0], isTie: false, tied: [] };
    }

    return { dominant: null, isTie: true, tied: topEmojis };
  }, [selectedEmojis, occurrenceScore, dominantOverride]);

  const setDominant = (emoji) => {
    if (!emoji) return;
    setDominantOverride(emoji);
  };

  const resetSelection = () => {
    setSelectedEmojis([]);
    setComparisons([]);
    setDominantOverride(null);
  };

  return {
    selectedEmojis,
    setSelectedEmojis,
    toggleEmoji,
    pairs,
    comparisons,
    recordComparison,
    occurrenceScore,
    cooccurrenceMatrix,
    dominantStatus,
    setDominant,
    resetSelection
  };
}
