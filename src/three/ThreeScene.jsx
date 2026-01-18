import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene({ nodes, links = [], mode }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const groupRef = useRef(null);
  const starsRef = useRef(null);

  // Sécurité absolue
  if (!nodes || nodes.length === 0) return null;

  useEffect(() => {
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040210);
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

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1400;
      starPositions[i + 1] = (Math.random() - 0.5) * 1400;
      starPositions[i + 2] = -600 + Math.random() * 1200;
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.6,
      transparent: true,
      opacity: 0.6
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    starsRef.current = stars;
    scene.add(stars);

    const light = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light);

    const nodePositions = new Map();

    // Création sprites
    nodes.forEach((node, index) => {
      if (!node?.emoji) return;

      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext("2d");
      ctx.font = "168px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.emoji, 128, 150);

      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(mat);

      const radius = 160 + Math.random() * 140;
      const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
      sprite.position.set(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 120
      );
      const scale = 68 + (node.weight || 1) * 8;
      sprite.scale.set(scale, scale, 1);

      group.add(sprite);
      nodePositions.set(node.id, sprite.position);
    });

    if (links.length > 0) {
      const lineGeometry = new THREE.BufferGeometry();
      const lineVertices = [];
      links.forEach(({ source, target, weight }) => {
        const sourcePos = nodePositions.get(source);
        const targetPos = nodePositions.get(target);
        if (!sourcePos || !targetPos) return;
        lineVertices.push(
          sourcePos.x,
          sourcePos.y,
          sourcePos.z,
          targetPos.x,
          targetPos.y,
          targetPos.z
        );
      });
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineVertices, 3)
      );
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xa68dff,
        transparent: true,
        opacity: 0.35
      });
      const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lineSegments);
    }

    let frame;
    const animate = () => {
      if (mode === "RESONANCE") {
        group.rotation.z += 0.002;
        group.rotation.y += 0.001;
      } else {
        group.rotation.z += 0.0004;
      }
      if (stars) {
        stars.rotation.y += 0.0003;
        stars.rotation.x += 0.0002;
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
  }, [nodes, links, mode]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
