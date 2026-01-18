import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene({ nodes, mode }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const groupRef = useRef(null);

  // Sécurité absolue
  if (!nodes || nodes.length === 0) return null;

  useEffect(() => {
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 700;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    const light = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light);

    // Création sprites
    nodes.forEach((node) => {
      if (!node?.emoji) return;

      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext("2d");
      ctx.font = "160px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.emoji, 128, 150);

      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(mat);

      sprite.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        0
      );
      sprite.scale.set(90, 90, 1);

      group.add(sprite);
    });

    let frame;
    const animate = () => {
      if (mode === "RESONANCE") {
        group.rotation.z += 0.002;
        group.rotation.y += 0.001;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, [nodes, mode]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
