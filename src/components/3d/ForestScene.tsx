"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "@/context/ThemeContext";
import * as THREE from "three";
import {
  FallingLeaves,
  FlyingBirds,
  ForestGlobe,
  CloudField,
} from "./ForestComponents";

// Camera controller that responds to mouse coordinates for parallax
function CameraController() {
  useFrame((state) => {
    // Convert pointer coords (-1 to 1) to camera offset
    const x = state.pointer.x * 2.5;
    const y = (state.pointer.y * 1.5) + 3; // Keep camera elevated
    
    // Smooth lerp (linear interpolation)
    state.camera.position.x += (x - state.camera.position.x) * 0.05;
    state.camera.position.y += (y - state.camera.position.y) * 0.05;
    
    // Look towards the center planet
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

// Sunrise / Twilight Sun
function SunSphere() {
  const { theme } = useTheme();
  const sunColor = theme === "dark" ? "#1e3a24" : "#ffb74d";
  const sunPosition: [number, number, number] = [0, 8, -25];

  return (
    <mesh position={sunPosition}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshBasicMaterial color={sunColor} />
    </mesh>
  );
}

export default function ForestScene() {
  const { theme } = useTheme();

  // Dynamic colors based on Dark/Light theme
  const fogColor = theme === "dark" ? "#060e0a" : "#e0f2f1";
  const ambientIntensity = theme === "dark" ? 0.25 : 0.65;
  const directIntensity = theme === "dark" ? 0.35 : 1.2;
  const sunlightColor = theme === "dark" ? "#388E3C" : "#fffde7";

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#e0f2f1] to-[#b2dfdb] dark:from-[#060e0a] dark:to-[#081f14] transition-colors duration-500">
      <Canvas
        shadows
        camera={{ position: [0, 3, 10], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 8, 30]} />

        {/* Ambient environment glow */}
        <ambientLight intensity={ambientIntensity} />

        {/* Sunlight casting shadows */}
        <directionalLight
          castShadow
          position={[5, 12, 5]}
          intensity={directIntensity}
          color={sunlightColor}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Local mist glow */}
        <pointLight position={[0, 4, -4]} intensity={0.5} color="#80deea" />

        <Suspense fallback={null}>
          {/* Environment Elements */}
          <SunSphere />

          {/* Core Floating Forest Globe centered in space */}
          <ForestGlobe position={[0, 0.2, 0]} scale={1.5} />

          {/* Volumetric Cloud Field representing the sky in the template */}
          <CloudField count={35} />

          {/* Dynamic weather particles & soaring birds */}
          <FallingLeaves count={80} />
          <FlyingBirds count={8} />

          {/* Camera movement controller */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
