import { useState } from "react";
import ThreeScene from "./three/ThreeScene";
import Header from "./ui/Header";
import EmojiPicker from "./ui/EmojiPicker";
import BottomPanel from "./ui/BottomPanel";

import { QUESTIONS } from "./data/questions";
import { useMythEngine } from "./state/useMythEngine";

import MoodQuestion from "./ui/MoodQuestion";
import MythReveal from "./ui/MythReveal";

export default function App() {
  const [step, setStep] = useState("QUESTIONS");
  const [qIndex, setQIndex] = useState(0);
  const [mode, setMode] = useState("POSE");
  const [constellation, setConstellation] = useState([]);

  const mythEngine = useMythEngine();
  const question = QUESTIONS[qIndex];

  const handleChoice = (option) => {
    mythEngine.addTags(option.tags);

    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(i => i + 1);
    } else {
      const myth = mythEngine.revealMyth();

      const nodes = myth.emojis.map(e => ({
        id: crypto.randomUUID(),
        emoji: e
      }));

      setConstellation(nodes);
      setStep("REVEAL");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>

      {step === "QUESTIONS" && (
        <MoodQuestion
          question={question}
          onChoose={handleChoice}
        />
      )}

      {step === "REVEAL" && (
        <MythReveal
          myth={mythEngine.myth}
          onContinue={() => setStep("CONSTELLATION")}
        />
      )}

      {step === "CONSTELLATION" && (
        <>
          <ThreeScene
            nodes={constellation}
            mode={mode}
          />

          <Header />

          <EmojiPicker
            onAdd={(emoji) =>
              setConstellation(prev => [
                ...prev,
                { id: crypto.randomUUID(), emoji }
              ])
            }
          />

          <BottomPanel
            canResonate={true}
            mode={mode}
            onResonate={() =>
              setMode(m => m === "RESONANCE" ? "POSE" : "RESONANCE")
            }
          />
        </>
      )}
    </div>
  );
}
