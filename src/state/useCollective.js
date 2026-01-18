import { useState } from "react";

export function useCollective() {
  const [collective, setCollective] = useState({
    density: 0.5,
    intensity: 0.4,
    drift: "convergence"
  });

  const randomize = () => {
    setCollective({
      density: Math.random(),
      intensity: Math.random(),
      drift: ["convergence", "dispersion", "apaisement"]
        [Math.floor(Math.random() * 3)]
    });
  };

  return { collective, randomize };
}
