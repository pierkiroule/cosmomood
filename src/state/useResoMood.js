import { useMemo, useState } from "react";

export function useResoMood() {
  const [tags, setTags] = useState(new Set(["calme"]));
  const [nodes, setNodes] = useState([
    { id: crypto.randomUUID(), emoji: "✨" }
  ]);

  const addEmoji = (emoji) => {
    setNodes(prev => {
      if (prev.length >= 12) return prev;
      return [...prev, { id: crypto.randomUUID(), emoji }];
    });
  };

  const metrics = useMemo(() => {
    const density = Math.min((nodes.length + tags.size) / 18, 1);
    const centrality = Math.max(0, 1 - (nodes.length - 1) / 10);
    return { density, centrality };
  }, [nodes, tags]);

  return {
    tags,
    setTags,
    nodes,
    addEmoji,
    metrics
  };
}
