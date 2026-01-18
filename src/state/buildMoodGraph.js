export function buildMoodGraph({ selectedEmojis, occurrenceScore, cooccurrenceMatrix }) {
  const nodes = (selectedEmojis || []).map(emoji => ({
    id: emoji,
    weight: 1 + (occurrenceScore?.[emoji] || 0)
  }));

  const links = [];
  if (cooccurrenceMatrix) {
    Object.keys(cooccurrenceMatrix).forEach(source => {
      Object.keys(cooccurrenceMatrix[source]).forEach(target => {
        links.push({
          source,
          target,
          weight: cooccurrenceMatrix[source][target]
        });
      });
    });
  }

  return { nodes, links };
}
