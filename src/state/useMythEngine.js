import { useState } from "react";
import { MYTHS } from "../data/myths";

export function useMythEngine() {
  const [tags, setTags] = useState([]);
  const [myth, setMyth] = useState(null);

  const addTags = (newTags) => {
    setTags(prev => [...prev, ...newTags]);
  };

  const revealMyth = () => {
    let best = null;
    let scoreMax = -1;

    MYTHS.forEach(m => {
      const score = m.tags.filter(t => tags.includes(t)).length;
      if (score > scoreMax) {
        scoreMax = score;
        best = m;
      }
    });

    setMyth(best);
    return best;
  };

  return {
    tags,
    myth,
    addTags,
    revealMyth
  };
}
