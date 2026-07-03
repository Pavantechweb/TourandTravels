"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "@/context/ThemeContext";
import * as THREE from "three";
import gsap from "gsap";
import {
  SwayingTree,
  FallingLeaves,
  FlyingBirds,
  CloudField,
  GodRays,
  ForestCabin,
  CozyFirePit,
  Waterfall,
} from "./ForestComponents";

// Camera controller that performs a smooth scroll-triggered camera zoom/pan using GSAP focusing on the cabin
function CameraController() {
  const { camera } = useThree();
  const scrollData = useRef({ z: 7.5, y: 1.2 });

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      
      // GSAP smoothly zooms camera towards the cozy A-frame cabin window on scroll
      gsap.to(scrollData.current, {
        z: 7.5 - progress * 4.5, // zooms close to the cabin entrance
        y: 1.2 - progress * 0.8, // lowers camera viewpoint
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto"
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    // Parallax mouse coordinates
    const mouseX = state.pointer.x * 2.0;
    const mouseY = (state.pointer.y * 0.8) + scrollData.current.y;
    
    // Smoothly interpolate camera position
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY - camera.position.y) * 0.05;
    camera.position.z += (scrollData.current.z - camera.position.z) * 0.05;

    // Lock camera orientation looking at the center of the cozy cabin
    camera.lookAt(0, 0.4, -2.5);
  });

  return null;
}

// Mossy Ground Terrain
function MossyGround() {
  const { theme } = useTheme();
  // Deep forest green in dark mode, soft mossy green in light mode
  const groundColor = theme === "dark" ? "#0a1f0f" : "#4caf50";

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color={groundColor} roughness={0.9} flatShading />
    </mesh>
  );
}

// Background Sun / Moon glow sphere
function SunSphere() {
  const { theme } = useTheme();
  const sunColor = theme === "dark" ? "#1b3c25" : "#ffe082";
  const sunPosition: [number, number, number] = [0, 8, -25];

  return (
    <mesh position={sunPosition}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial color={sunColor} />
    </mesh>
  );
}

export default function ForestScene() {
  const { theme } = useTheme();

  // Sky environment colors based on active theme
  const fogColor = theme === "dark" ? "#040c06" : "#e8f5e9";
  const ambientIntensity = theme === "dark" ? 0.3 : 0.8;
  const directIntensity = theme === "dark" ? 0.45 : 1.3;
  const sunlightColor = theme === "dark" ? "#1b5e20" : "#fffde7";

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9] dark:from-[#040c06] dark:to-[#091a0f] transition-colors duration-500">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 7.5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 6, 26]} />

        {/* Ambient forest canopy lighting */}
        <ambientLight intensity={ambientIntensity} />

        {/* Directed sunlight casting shadows */}
        <directionalLight
          castShadow
          position={[8, 12, -4]}
          intensity={directIntensity}
          color={sunlightColor}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />

        <Suspense fallback={null}>
          {/* Sun Sphere */}
          <SunSphere />

          {/* Grassy Moss Terrain */}
          <MossyGround />

          {/* Cozy A-Frame Wooden Stay Cabin */}
          <ForestCabin position={[0, -0.6, -2.5]} />

          {/* Cozy Fire Pit with flame & flickering light */}
          <CozyFirePit position={[0, -0.5, 0.8]} />

          {/* Background Waterfall Ledge & Stream (driven by GSAP progress timeline) */}
          <mesh position={[0, 2.8, -12]} castShadow receiveShadow>
            <boxGeometry args={[4, 1.2, 2]} />
            <meshStandardMaterial color={theme === "dark" ? "#1e2920" : "#5d5c56"} roughness={0.9} />
          </mesh>
          <Waterfall position={[0, 2.2, -11]} />

          {/* DENSE SWAYING PINE FORESTS (Framing left & right margins, swaying under wind via GSAP tweens) */}
          {/* Left Forest Canopy */}
          <SwayingTree position={[-3.8, -0.6, 3]} scale={1.05} />
          <SwayingTree position={[-4.5, -0.6, 0]} scale={1.2} />
          <SwayingTree position={[-3.5, -0.6, -3]} scale={1.0} />
          <SwayingTree position={[-5.2, -0.6, -6]} scale={1.3} />
          <SwayingTree position={[-4.0, -0.6, -9]} scale={1.1} />

          {/* Right Forest Canopy */}
          <SwayingTree position={[3.8, -0.6, 3]} scale={1.0} />
          <SwayingTree position={[4.5, -0.6, 0]} scale={1.25} />
          <SwayingTree position={[3.5, -0.6, -3]} scale={1.05} />
          <SwayingTree position={[5.2, -0.6, -6]} scale={1.35} />
          <SwayingTree position={[4.0, -0.6, -9]} scale={1.15} />

          {/* Volumetric cloud field drifting dynamically in the sky (motion clouds) */}
          <CloudField count={30} />

          {/* Volumetric God rays passing through the branches */}
          <GodRays count={6} />

          {/* Soaring birds & drifting pollen particles */}
          <FallingLeaves count={50} />
          <FlyingBirds count={6} />

          {/* Camera panning & GSAP scroll parallax */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
