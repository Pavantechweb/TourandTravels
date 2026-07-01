"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Swaying Pine Tree Component
export function SwayingTree({ position, scale = 1, swaySpeed = 1, swayAmount = 0.03 }: {
  position: [number, number, number];
  scale?: number;
  swaySpeed?: number;
  swayAmount?: number;
}) {
  const treeRef = useRef<THREE.Group>(null);
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (treeRef.current) {
      const time = state.clock.getElapsedTime();
      // Sway animation using sine wave with random offset
      const swayX = Math.sin(time * swaySpeed + randomOffset) * swayAmount;
      const swayZ = Math.cos(time * swaySpeed * 0.8 + randomOffset) * (swayAmount * 0.8);
      
      // Keep root fixed, rotate from base
      treeRef.current.rotation.z = swayX;
      treeRef.current.rotation.x = swayZ;
    }
  });

  return (
    <group ref={treeRef} position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.25, 2, 8]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Leaves Layer 1 */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1, 1.6, 5]} />
        <meshStandardMaterial color="#1B5E20" roughness={0.85} flatShading />
      </mesh>
      {/* Leaves Layer 2 */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.8, 1.4, 5]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} flatShading />
      </mesh>
      {/* Leaves Layer 3 */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2, 5]} />
        <meshStandardMaterial color="#388E3C" roughness={0.75} flatShading />
      </mesh>
    </group>
  );
}

// 2. Procedural Mountain Peaks
export function Mountain({ position, scale = [1, 1, 1], color = "#1e3020" }: {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[3, 6, 4]} />
      <meshStandardMaterial color={color} roughness={0.9} flatShading />
    </mesh>
  );
}

// 3. Falling Particle-based Waterfall
export function Waterfall({ position }: { position: [number, number, number] }) {
  const count = 180;
  const meshRef = useRef<THREE.Points>(null);

  // Generate initial particle positions and speeds
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spawn at the top ledge
      pos[i * 3] = position[0] + (Math.random() - 0.5) * 0.7; // Spread on X
      pos[i * 3 + 1] = position[1] - Math.random() * 8; // Random Y start height
      pos[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.2; // Spread on Z
      spd[i] = 2.5 + Math.random() * 2.5; // Fall speed
    }
    return [pos, spd];
  }, [position]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      const posArray = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        // Fall down
        posArray[i * 3 + 1] -= speeds[i] * delta;

        // Add wind/splash noise
        posArray[i * 3] += Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.005;

        // Reset if hits bottom reservoir
        if (posArray[i * 3 + 1] < position[1] - 8) {
          posArray[i * 3 + 1] = position[1]; // back to top
          posArray[i * 3] = position[0] + (Math.random() - 0.5) * 0.7;
          posArray[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.2;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Waterfall stream particles */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#80deea"
          size={0.12}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Splash Mist/Clouds at bottom */}
      <MistSpray position={[position[0], position[1] - 8, position[2] + 0.2]} />
    </group>
  );
}

// Waterfall Splash Mist
function MistSpray({ position }: { position: [number, number, number] }) {
  const count = 40;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = position[0] + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = position[1] + (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 1.5;

      vel[i * 3] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = Math.random() * 0.5; // Rise slightly
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return [pos, vel];
  }, [position]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      const posArray = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        posArray[i * 3] += velocities[i * 3] * delta;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Reset if floats too high or wide
        if (posArray[i * 3 + 1] > position[1] + 1.5) {
          posArray[i * 3] = position[0] + (Math.random() - 0.5) * 1.5;
          posArray[i * 3 + 1] = position[1] + (Math.random() - 0.5) * 0.2;
          posArray[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 1.5;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e0f7fa"
        size={0.25}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 4. Drifting Leaves Particles (Wind Effect)
export function FallingLeaves({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const leaves = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 35,
          8 + Math.random() * 12,
          (Math.random() - 0.5) * 20
        ),
        speed: 1 + Math.random() * 2,
        rotationSpeed: 0.5 + Math.random() * 1.5,
        windFactor: 0.2 + Math.random() * 0.8,
        scale: 0.08 + Math.random() * 0.08,
        offset: Math.random() * 100,
      });
    }
    return data;
  }, [count]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      leaves.forEach((leaf, i) => {
        const time = state.clock.getElapsedTime() + leaf.offset;
        
        // Fall downwards
        leaf.position.y -= leaf.speed * delta;
        // Sway sideways (wind)
        leaf.position.x += Math.sin(time + leaf.position.y * 0.2) * 0.02 * leaf.windFactor;
        leaf.position.z += Math.cos(time * 0.7) * 0.01 * leaf.windFactor;

        // Reset if it goes below screen or ground
        if (leaf.position.y < -3) {
          leaf.position.y = 15;
          leaf.position.x = (Math.random() - 0.5) * 35;
        }

        dummy.position.copy(leaf.position);
        dummy.rotation.set(time * leaf.rotationSpeed, time * 0.5, time * 0.2);
        dummy.scale.set(leaf.scale, leaf.scale * 1.5, leaf.scale * 0.8);
        dummy.updateMatrix();
        
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} castShadow>
      <coneGeometry args={[0.5, 1, 3]} />
      <meshStandardMaterial color="#81c784" roughness={0.7} flatShading />
    </instancedMesh>
  );
}

// 5. Soaring Birds Group
export function FlyingBirds({ count = 8 }: { count?: number }) {
  const birds = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        pivot: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          6 + Math.random() * 5,
          -10 + (Math.random() - 0.5) * 5
        ),
        radius: 6 + Math.random() * 6,
        speed: 0.3 + Math.random() * 0.4,
        scale: 0.12 + Math.random() * 0.08,
        angleOffset: Math.random() * Math.PI * 2,
        wingFlapSpeed: 10 + Math.random() * 8,
      });
    }
    return data;
  }, [count]);

  const birdRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    birds.forEach((bird, i) => {
      const group = birdRefs.current[i];
      if (group) {
        const angle = time * bird.speed + bird.angleOffset;
        
        // Circular flying path
        const x = bird.pivot.x + Math.sin(angle) * bird.radius;
        const z = bird.pivot.z + Math.cos(angle) * bird.radius;
        const y = bird.pivot.y + Math.sin(time + i) * 0.5; // Slight height bobbing

        group.position.set(x, y, z);
        
        // Face forward along path tangent
        group.rotation.y = angle + Math.PI / 2;
        
        // Wing flapping
        const leftWing = group.children[0] as THREE.Mesh;
        const rightWing = group.children[1] as THREE.Mesh;
        if (leftWing && rightWing) {
          const flap = Math.sin(time * bird.wingFlapSpeed) * 0.6;
          leftWing.rotation.z = -flap;
          rightWing.rotation.z = flap;
        }
      }
    });
  });

  return (
    <group>
      {birds.map((bird, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) birdRefs.current[i] = el;
          }}
          scale={[bird.scale, bird.scale, bird.scale]}
        >
          {/* Left Wing */}
          <mesh castShadow position={[-0.5, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1, 0.02, 0.4]} />
            <meshStandardMaterial color="#fafafa" roughness={0.8} />
          </mesh>
          {/* Right Wing */}
          <mesh castShadow position={[0.5, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1, 0.02, 0.4]} />
            <meshStandardMaterial color="#fafafa" roughness={0.8} />
          </mesh>
          {/* Bird Body */}
          <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.15, 0.6, 4]} />
            <meshStandardMaterial color="#ededed" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 6. Slow Floating Clouds
export function FloatingClouds({ count = 5 }: { count?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const cloudData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          -20 + Math.random() * 40,
          9 + Math.random() * 3,
          -12 + Math.random() * 6
        ),
        speed: 0.15 + Math.random() * 0.25,
        scale: new THREE.Vector3(
          1.5 + Math.random() * 1.5,
          0.8 + Math.random() * 0.5,
          1 + Math.random() * 1
        ),
      });
    }
    return data;
  }, [count]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.children.forEach((cloud, i) => {
        cloud.position.x += cloudData[i].speed * delta;
        // Reset if floats off right side
        if (cloud.position.x > 25) {
          cloud.position.x = -25;
        }
      });
    }
  });

  return (
    <group ref={meshRef}>
      {cloudData.map((cloud, i) => (
        <group key={i} position={cloud.position} scale={cloud.scale}>
          {/* Soft multi-layered puff clouds */}
          <mesh castShadow>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#fafafa" transparent opacity={0.65} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.8, -0.2, 0.2]} scale={[0.8, 0.8, 0.8]}>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#fafafa" transparent opacity={0.65} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[-0.8, -0.1, -0.2]} scale={[0.7, 0.7, 0.7]}>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#fafafa" transparent opacity={0.65} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 7. Immersive Floating Forest Globe (Reference template image: 3D Nature Planet)
export function ForestGlobe({ position = [0, 4.5, -4], scale = 1.3 }: {
  position?: [number, number, number];
  scale?: number;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const cloudRingRef = useRef<THREE.Group>(null);

  // Generate random coordinate distributions on a sphere
  const surfaceElements = useMemo(() => {
    const list = [];
    const count = 50;
    const r = 2.0; // sphere radius

    for (let i = 0; i < count; i++) {
      // Fibonacci lattice distribution on a sphere for uniform layout
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Determine element type: 75% Trees, 25% Mountains
      const isTree = Math.random() > 0.25;

      list.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        isTree,
        scale: isTree ? 0.08 + Math.random() * 0.08 : 0.15 + Math.random() * 0.15,
        color: isTree 
          ? (Math.random() > 0.5 ? "#1B5E20" : "#2E7D32") 
          : "#3b6043",
        // Quaternion to align Y-axis straight out from center
        quaternion: new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(x, y, z).normalize()
        )
      });
    }
    return list;
  }, []);

  // Orbiting clouds list
  const orbitingClouds = useMemo(() => {
    const list = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.5;
      list.push({
        id: i,
        angle,
        height,
        radius: 2.8 + Math.random() * 0.4,
        scale: 0.15 + Math.random() * 0.15,
        speed: 0.2 + Math.random() * 0.2
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (globeRef.current) {
      // Slow rotation on Y axis
      globeRef.current.rotation.y += 0.06 * delta;
      globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.05;
      
      // Gentle floating bobbing effect
      globeRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
    }
    if (cloudRingRef.current) {
      // Opposite rotation for clouds
      cloudRingRef.current.rotation.y -= 0.12 * delta;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      
      {/* 1. Core Rotating Planet Globe */}
      <group ref={globeRef}>
        
        {/* Ocean Sphere base */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2.0, 32, 32]} />
          <meshStandardMaterial color="#00bcd4" roughness={0.4} metalness={0.1} flatShading={false} />
        </mesh>

        {/* Continents Green Land masses (overlapping slightly larger bumpy spheres) */}
        <mesh scale={[1.01, 1.01, 1.01]} receiveShadow>
          <sphereGeometry args={[1.98, 16, 16]} />
          <meshStandardMaterial color="#388e3c" roughness={0.9} flatShading />
        </mesh>

        {/* Distributed low-poly Trees & Mountains aligned outwards */}
        {surfaceElements.map((el) => (
          <group
            key={el.id}
            position={[el.position.x, el.position.y, el.position.z]}
            quaternion={[el.quaternion.x, el.quaternion.y, el.quaternion.z, el.quaternion.w]}
            scale={[el.scale, el.scale, el.scale]}
          >
            {el.isTree ? (
              // Swaying-like static tree cone pointing straight out
              <group>
                <mesh castShadow>
                  <cylinderGeometry args={[0.1, 0.15, 1, 6]} />
                  <meshStandardMaterial color="#3e2723" roughness={0.9} />
                </mesh>
                <mesh position={[0, 1, 0]} castShadow>
                  <coneGeometry args={[0.8, 1.5, 5]} />
                  <meshStandardMaterial color={el.color} roughness={0.8} flatShading />
                </mesh>
              </group>
            ) : (
              // Mountain peak cone
              <mesh castShadow>
                <coneGeometry args={[1.2, 2, 4]} />
                <meshStandardMaterial color={el.color} roughness={0.9} flatShading />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* 2. Floating Orbiting Clouds Ring */}
      <group ref={cloudRingRef}>
        {orbitingClouds.map((cloud) => {
          // Trigonometric positions
          const x = Math.cos(cloud.angle) * cloud.radius;
          const z = Math.sin(cloud.angle) * cloud.radius;
          return (
            <group
              key={cloud.id}
              position={[x, cloud.height, z]}
              scale={[cloud.scale, cloud.scale, cloud.scale]}
            >
              <mesh castShadow>
                <dodecahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.95} flatShading />
              </mesh>
              <mesh position={[0.7, -0.1, 0.1]} scale={0.7} castShadow>
                <dodecahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.95} flatShading />
              </mesh>
            </group>
          );
        })}
      </group>

    </group>
  );
}

// 8. Volumetric Cloud Field representing the sky in the template image
export function CloudField({ count = 30 }: { count?: number }) {
  const clouds = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 45,
          (Math.random() - 0.5) * 20 - 2, // slightly lower
          -12 + (Math.random() - 0.5) * 12
        ),
        scale: new THREE.Vector3(
          2.5 + Math.random() * 2.5,
          1.2 + Math.random() * 0.8,
          1.8 + Math.random() * 1.5
        ),
        speed: 0.08 + Math.random() * 0.12
      });
    }
    return list;
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((cloud, i) => {
        cloud.position.x += clouds[i].speed * delta;
        // Reset if it goes off right side
        if (cloud.position.x > 30) {
          cloud.position.x = -30;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud) => (
        <group key={cloud.id} position={cloud.position} scale={cloud.scale}>
          {/* Soft cloud shapes */}
          <mesh castShadow>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.8, -0.2, 0.2]} scale={0.7} castShadow>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[-0.8, -0.1, -0.2]} scale={0.6} castShadow>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}


