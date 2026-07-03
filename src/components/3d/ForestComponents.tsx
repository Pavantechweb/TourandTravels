import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useTheme } from "@/context/ThemeContext";

// 1. Swaying Pine Tree Component
export function SwayingTree({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) {
  const treeRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (treeRef.current) {
      // Staggered wind sway rotation powered by GSAP
      gsap.to(treeRef.current.rotation, {
        z: "random(-0.02, 0.02)",
        x: "random(-0.015, 0.015)",
        duration: "random(4.5, 7.5)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatRefresh: true
      });
    }
  }, []);

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
  const progressObj = useRef({ val: 0 });

  // Generate initial particle positions
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = position[0] + (Math.random() - 0.5) * 0.7; // Spread X
      pos[i * 3 + 1] = position[1] - Math.random() * 8; // Spread Y
      pos[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.2; // Spread Z
      spd[i] = 2.0 + Math.random() * 2.0; // individual speed scaling
    }
    return [pos, spd];
  }, [position]);

  useEffect(() => {
    // Infinite progress loop for waterfall flow powered by GSAP
    gsap.to(progressObj.current, {
      val: 1.0,
      duration: 1.8,
      ease: "none",
      repeat: -1
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      const posArray = geo.attributes.position.array as Float32Array;
      const p = progressObj.current.val;

      for (let i = 0; i < count; i++) {
        // Calculate progressive fall height
        const offset = (i / count);
        const fall = ((p + offset) % 1.0);
        posArray[i * 3 + 1] = position[1] - (fall * 8);

        // Add small sway/spray offsets
        posArray[i * 3] = position[0] + Math.sin(state.clock.getElapsedTime() * 4 + i) * 0.05;
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
export function ForestGlobe({ position = [0, 0, 0], scale = 1.4 }: {
  position?: [number, number, number];
  scale?: number;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const cloudRingRef = useRef<THREE.Group>(null);

  // Generate random coordinate distributions on a sphere
  const surfaceElements = useMemo(() => {
    const list = [];
    const count = 75; // More trees & mountains for density
    const r = 2.0; // sphere radius

    for (let i = 0; i < count; i++) {
      // Fibonacci lattice distribution on a sphere for uniform layout
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Determine element type: 80% Trees, 20% Mountains
      const isTree = Math.random() > 0.20;

      list.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        isTree,
        scale: isTree ? 0.08 + Math.random() * 0.08 : 0.14 + Math.random() * 0.14,
        color: isTree 
          ? (Math.random() > 0.5 ? "#1b5e20" : "#2e7d32") 
          : "#4e342e", // earthy brown for mountains
        // Quaternion to align Y-axis straight out from center
        quaternion: new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(x, y, z).normalize()
        )
      });
    }
    return list;
  }, []);

  // Landmasses representing continents
  const landmasses = useMemo(() => {
    const list = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.9;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      list.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        scale: 0.9 + Math.random() * 0.5
      });
    }
    return list;
  }, []);

  // Orbiting clouds list
  const orbitingClouds = useMemo(() => {
    const list = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.5;
      list.push({
        id: i,
        angle,
        height,
        radius: 2.8 + Math.random() * 0.4,
        scale: 0.18 + Math.random() * 0.15,
        speed: 0.15 + Math.random() * 0.15
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (globeRef.current) {
      // Slow rotation on Y axis
      globeRef.current.rotation.y += 0.05 * delta;
      globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.12) * 0.04;
      
      // Gentle floating bobbing effect
      globeRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.6) * 0.12;
    }
    if (cloudRingRef.current) {
      // Opposite rotation for clouds
      cloudRingRef.current.rotation.y -= 0.08 * delta;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      
      {/* 1. Core Rotating Planet Globe */}
      <group ref={globeRef}>
        
        {/* Deep Ocean base */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2.0, 32, 32]} />
          <meshStandardMaterial color="#0d47a1" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Continents Green Land masses (overlapping slightly larger bumpy spheres) */}
        {landmasses.map((land) => (
          <mesh key={land.id} position={land.position} scale={land.scale} receiveShadow castShadow>
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshStandardMaterial color="#33691e" roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Atmosphere glow shell */}
        <mesh scale={[1.08, 1.08, 1.08]}>
          <sphereGeometry args={[2.0, 32, 32]} />
          <meshStandardMaterial color="#80deea" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
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
              <group>
                <mesh castShadow>
                  <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
                  <meshStandardMaterial color="#5d4037" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.7, 0]} castShadow>
                  <coneGeometry args={[0.6, 1.2, 5]} />
                  <meshStandardMaterial color={el.color} roughness={0.8} flatShading />
                </mesh>
              </group>
            ) : (
              <mesh castShadow>
                <coneGeometry args={[1.0, 1.6, 4]} />
                <meshStandardMaterial color={el.color} roughness={0.9} flatShading />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* 2. Floating Orbiting Clouds Ring */}
      <group ref={cloudRingRef}>
        {orbitingClouds.map((cloud) => {
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

// 9. Volumetric God Rays Component
export function GodRays({ count = 8 }: { count?: number }) {
  const rays = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 22,
          7,
          -8 - Math.random() * 15
        ] as [number, number, number],
        scale: [
          1.0 + Math.random() * 1.8,
          18 + Math.random() * 8,
          1.0 + Math.random() * 1.8
        ] as [number, number, number],
        rotation: [
          0.3 + Math.random() * 0.18, // angled downwards towards camera
          0,
          (Math.random() - 0.5) * 0.35
        ] as [number, number, number]
      });
    }
    return list;
  }, [count]);

  return (
    <group>
      {rays.map((ray) => (
        <mesh
          key={ray.id}
          position={ray.position}
          scale={ray.scale}
          rotation={ray.rotation}
        >
          <cylinderGeometry args={[0.02, 1.4, 1, 8]} />
          <meshBasicMaterial
            color="#fffde7"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// 10. Fluttering Butterflies
export function Butterflies({ count = 8 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const butterflyData = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        startPos: [
          (Math.random() - 0.5) * 10,
          1 + Math.random() * 2.5,
          -1 - Math.random() * 7
        ] as [number, number, number],
        radius: 0.8 + Math.random() * 1.2,
        speed: 1.0 + Math.random() * 0.8,
        color: Math.random() > 0.5 ? "#00e5ff" : "#ffea00",
        offset: Math.random() * Math.PI * 2
      });
    }
    return list;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((childGroup, idx) => {
        const data = butterflyData[idx];
        const angle = time * data.speed + data.offset;
        
        // Circular/elliptical movement in XZ plane
        childGroup.position.x = data.startPos[0] + Math.cos(angle) * data.radius;
        childGroup.position.z = data.startPos[2] + Math.sin(angle) * data.radius;
        
        // Flutter height bounce
        childGroup.position.y = data.startPos[1] + Math.sin(time * 4.5 + data.offset) * 0.35;
        
        // Rotate body to face motion direction
        childGroup.rotation.y = -angle + Math.PI / 2;

        // Wing flapping: Left wing (index 0), Right wing (index 1) of butterfly inner group
        const butterflyInner = childGroup.children[0];
        if (butterflyInner) {
          const leftWing = butterflyInner.children[0];
          const rightWing = butterflyInner.children[1];
          if (leftWing && rightWing) {
            leftWing.rotation.z = Math.sin(time * 30) * 0.7;
            rightWing.rotation.z = -Math.sin(time * 30) * 0.7;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {butterflyData.map((data) => (
        <group key={data.id}>
          {/* Inner assembly containing wings and body */}
          <group>
            {/* Left Wing */}
            <mesh position={[-0.06, 0, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.1, 0.01, 0.08]} />
              <meshBasicMaterial color={data.color} />
            </mesh>
            {/* Right Wing */}
            <mesh position={[0.06, 0, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.1, 0.01, 0.08]} />
              <meshBasicMaterial color={data.color} />
            </mesh>
            {/* Body */}
            <mesh>
              <cylinderGeometry args={[0.012, 0.012, 0.1, 4]} />
              <meshBasicMaterial color="#212121" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

// 11. 3D Fjord Wooden Boat Component with GSAP float & sway
export function FjordBoat({ position = [0, -0.85, 2] }: { position?: [number, number, number] }) {
  const boatRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (boatRef.current) {
      // Gentle Y-axis floating bounce
      gsap.to(boatRef.current.position, {
        y: position[1] + 0.04,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Gentle rolling roll-sway (Z-axis)
      gsap.to(boatRef.current.rotation, {
        z: 0.03,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Gentle pitching sway (X-axis)
      gsap.to(boatRef.current.rotation, {
        x: 0.015,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, [position]);

  return (
    <group ref={boatRef} position={position}>
      {/* Boat hull base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.15, 0.6]} />
        <meshStandardMaterial color="#5d4037" roughness={0.85} />
      </mesh>
      {/* Left Hull Wall */}
      <mesh position={[0, 0.15, 0.3]} castShadow>
        <boxGeometry args={[1.4, 0.2, 0.05]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
      {/* Right Hull Wall */}
      <mesh position={[0, 0.15, -0.3]} castShadow>
        <boxGeometry args={[1.4, 0.2, 0.05]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
      {/* Front Point (Wedge) */}
      <mesh position={[0.78, 0.1, 0]} rotation={[0, 0, 0.4]} castShadow>
        <coneGeometry args={[0.3, 0.4, 4]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[-0.7, 0.15, 0]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.6]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Bench Seat inside */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.15, 0.05, 0.55]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.7} />
      </mesh>
    </group>
  );
}

// 12. Fjord Water plane
export function FjordWater() {
  const { theme } = useTheme();
  const waterColor = theme === "dark" ? "#002a24" : "#005b4f";
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Dynamic shift of lake elevation representing waves
      meshRef.current.position.y = -1.0 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.015;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial color={waterColor} roughness={0.15} metalness={0.8} />
    </mesh>
  );
}

// 13. Fjord Mountain Canyon Landscape (Left & Right rock cliffs)
export function FjordLandscape() {
  const { theme } = useTheme();
  const rockColor = theme === "dark" ? "#1e2920" : "#5d5c56";

  return (
    <group>
      {/* Left Wall Cliffs */}
      <group position={[-9, 0, -10]}>
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <boxGeometry args={[3, 8, 12]} />
          <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[1, 5, -6]}>
          <boxGeometry args={[3.2, 11, 8]} />
          <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Right Wall Cliffs */}
      <group position={[9, 0, -10]}>
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <boxGeometry args={[3, 8, 12]} />
          <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[-1, 5, -6]}>
          <boxGeometry args={[3.2, 11, 8]} />
          <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Distant Background Peaks */}
      <mesh position={[-6, 4, -25]} scale={[4.5, 5.5, 4.5]} castShadow>
        <coneGeometry args={[3, 6, 4]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[6, 3, -28]} scale={[4.2, 4.8, 4.2]} castShadow>
        <coneGeometry args={[3, 6, 4]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 5.5, -30]} scale={[5.5, 6.5, 5.5]} castShadow>
        <coneGeometry args={[3.2, 6, 4]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

// 14. 3D Forest Stay Cabin (A-frame Cabin) Component
export function ForestCabin({ position = [0, -0.6, -3] }: { position?: [number, number, number] }) {
  const cabinLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    if (cabinLightRef.current) {
      // Warm pulse from the cabin interior
      gsap.to(cabinLightRef.current, {
        intensity: 1.2,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <group position={position}>
      {/* 1. Stone Foundation */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#4e4d46" roughness={0.9} flatShading />
      </mesh>

      {/* 2. Wooden Floor Deck */}
      <mesh position={[0, 0.22, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[4.0, 0.05, 3.8]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.8} />
      </mesh>

      {/* 3. A-Frame Sloping Roof Panels */}
      {/* Left Roof Panel */}
      <mesh position={[-1.3, 1.8, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 3.8, 3.6]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>
      {/* Right Roof Panel */}
      <mesh position={[1.3, 1.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 3.8, 3.6]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>

      {/* 4. Wooden Back Wall */}
      <mesh position={[0, 1.5, -1.6]} castShadow>
        <boxGeometry args={[2.5, 2.6, 0.1]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>

      {/* 5. Glass Front Wall & Door Frame */}
      <group position={[0, 1.3, 1.6]}>
        {/* Glass panes */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 2.2, 0.05]} />
          <meshStandardMaterial color="#b2ebf2" transparent opacity={0.3} roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Wood Door Frame */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <boxGeometry args={[0.1, 2.2, 0.08]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <mesh position={[0, 0.9, 0.02]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
      </group>

      {/* 6. Cozy Interior Light */}
      <pointLight
        ref={cabinLightRef}
        position={[0, 1.2, 0]}
        intensity={0.7}
        distance={8}
        color="#ffb74d"
        castShadow
      />
    </group>
  );
}

// 15. Cozy Fire Pit Component with GSAP light flicker
export function CozyFirePit({ position = [0, -0.4, 1.2] }: { position?: [number, number, number] }) {
  const fireLightRef = useRef<THREE.PointLight>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (fireLightRef.current) {
      // Realistic randomized fire flame light flicker
      gsap.to(fireLightRef.current, {
        intensity: "random(0.6, 1.6)",
        duration: "random(0.04, 0.18)",
        repeat: -1,
        repeatRefresh: true,
        ease: "sine.inOut"
      });
    }
    if (flameRef.current) {
      // Flame scale vibration
      gsap.to(flameRef.current.scale, {
        x: 1.2,
        y: 1.4,
        z: 1.2,
        duration: 0.12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <group position={position}>
      {/* Stone Ring */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.45, 0.08, 8, 16]} />
        <meshStandardMaterial color="#616161" roughness={0.95} flatShading />
      </mesh>

      {/* Charcoal logs */}
      <mesh position={[0, 0.06, 0]} rotation={[0.2, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5]} />
        <meshStandardMaterial color="#212121" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[0.2, -0.6, 0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5]} />
        <meshStandardMaterial color="#212121" roughness={0.9} />
      </mesh>

      {/* Red/Orange Fire Flame */}
      <mesh ref={flameRef} position={[0, 0.18, 0]} castShadow>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshBasicMaterial color="#ff5722" />
      </mesh>

      {/* Glowing Light Source */}
      <pointLight
        ref={fireLightRef}
        position={[0, 0.3, 0]}
        intensity={1.0}
        distance={6}
        color="#ff7043"
        castShadow
      />
    </group>
  );
}





