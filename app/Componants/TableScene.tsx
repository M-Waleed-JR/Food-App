"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  RoundedBox,
  Sky,
} from "@react-three/drei";
import type { ReactNode } from "react";
import * as THREE from "three";

/* ============ Types ============ */
export type Area = "indoor" | "outdoor";

export type TableData = {
  id: number;
  label: string;
  x: number;
  z: number;
  seats: 2 | 3 | 4 | 6;
  shape: "round" | "square";
  reserved: boolean;
};

export type TableSceneProps = {
  area: Area;
  tables: TableData[];
  guests: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
};

type TState = "available" | "selected" | "unavailable";

/* ============ Constants ============ */
const PALETTE: Record<TState, { top: string; cushion: string }> = {
  available: { top: "#f4ebd0", cushion: "#f9f9f8" },
  selected: { top: "#ef4444", cushion: "#ef4444" },
  unavailable: { top: "#262626", cushion: "#404040" },
};

const TABLE_RADIUS: Record<TableData["seats"], number> = {
  2: 0.6,
  3: 0.85,
  4: 0.85,
  6: 1.1,
};

const CENTER_Z = -1;
const ROOM_W = 20;
const ROOM_D = 14;

// Floor darkness for the indoor wood (raise to make it lighter)
const INDOOR_FLOOR_LIGHTNESS = 26;
// Grass brightness for the outdoor lawn (raise = lighter grass)
const GRASS_LIGHTNESS = 30;

/* Shared geometries / materials (created once, reused by every chair/table) */
const LEG_GEO = new THREE.CylinderGeometry(0.025, 0.035, 0.4, 8);
const LEG_MAT = new THREE.MeshStandardMaterial({
  color: "#171717",
  roughness: 0.5,
  metalness: 0.4,
});
const CHAIR_LEGS: [number, number][] = [
  [-0.2, -0.2],
  [0.2, -0.2],
  [-0.2, 0.2],
  [0.2, 0.2],
];

/* ============ Procedural floor textures ============ */
// Seeded random so the floor looks the same on every render
function makeRng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFloorCanvas(kind: "wood" | "grass") {
  const rand = makeRng(kind === "wood" ? 7 : 21);
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;

  if (kind === "wood") {
    const rows = 10;
    const h = 512 / rows;
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * 128;
      // Two colors per row, reused with modulo so the tile wraps seamlessly
      const tones = [0, 1].map(() => INDOOR_FLOOR_LIGHTNESS + rand() * 7 - 3);
      for (let k = -1; k < 3; k++) {
        const x = k * 256 + offset;
        const y = r * h;
        g.fillStyle = `hsl(24 30% ${tones[((k % 2) + 2) % 2]}%)`;
        g.fillRect(x, y, 256, h);

        // wood grain
        g.strokeStyle = "rgba(0,0,0,0.12)";
        g.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const gy = y + 4 + rand() * (h - 8);
          g.beginPath();
          g.moveTo(x, gy);
          g.lineTo(x + 256, gy + (rand() - 0.5) * 3);
          g.stroke();
        }

        // plank seam
        g.strokeStyle = "rgba(0,0,0,0.65)";
        g.lineWidth = 2;
        g.strokeRect(x, y, 256, h);
      }
    }
  } else {
    // mowing stripes (two bands per tile)
    for (let i = 0; i < 2; i++) {
      const l = GRASS_LIGHTNESS + (i === 0 ? 2.5 : -2.5);
      g.fillStyle = `hsl(98 42% ${l}%)`;
      g.fillRect(0, i * 256, 512, 256);
    }
    // soft color patches so the lawn is not flat
    for (let i = 0; i < 260; i++) {
      const x = rand() * 512;
      const y = rand() * 512;
      const r = 8 + rand() * 26;
      const l = GRASS_LIGHTNESS - 6 + rand() * 12;
      g.fillStyle = `hsl(${85 + rand() * 30} 45% ${l}% / 0.12)`;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    // short grass blades
    for (let i = 0; i < 9000; i++) {
      const x = rand() * 512;
      const y = rand() * 512;
      const l = GRASS_LIGHTNESS - 8 + rand() * 18;
      g.strokeStyle = `hsl(${80 + rand() * 40} 48% ${l}%)`;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (rand() - 0.5) * 3, y - 3 - rand() * 5);
      g.stroke();
    }
  }
  return c;
}

function useFloorTexture(area: Area) {
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(
      makeFloorCanvas(area === "indoor" ? "wood" : "grass"),
    );
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(area === "indoor" ? 4 : 6, area === "indoor" ? 3 : 5);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [area]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/* ============ Floating label (sprite) ============ */
function Label({
  text,
  state,
  position,
}: {
  text: string;
  state: TState;
  position: [number, number, number];
}) {
  const compact = useThree((s) => s.size.width < 640);
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 160;
    const g = c.getContext("2d")!;
    g.fillStyle =
      state === "selected"
        ? "#dc2626"
        : state === "unavailable"
          ? "rgba(38,38,38,0.95)"
          : "rgba(255,255,255,0.95)";
    g.beginPath();
    g.roundRect(8, 20, 496, 120, 60);
    g.fill();
    g.fillStyle = state === "available" ? "#111111" : "#ffffff";
    g.font = "bold 48px Inter, system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 256, 82);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, state]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite
      position={position}
      scale={compact ? [3.4, 1.06, 1] : [2.4, 0.75, 1]}
      renderOrder={10}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthTest={false}
        toneMapped={false}
      />
    </sprite>
  );
}

/* ============ Chair ============ */
function Chair({
  position,
  angle,
  cushion,
}: {
  position: [number, number, number];
  angle: number;
  cushion: string;
}) {
  return (
    <group position={position} rotation={[0, angle, 0]}>
      <RoundedBox
        args={[0.56, 0.12, 0.56]}
        radius={0.06}
        smoothness={4}
        position={[0, 0.46, 0]}
        castShadow
      >
        <meshStandardMaterial color={cushion} roughness={0.7} />
      </RoundedBox>
      <RoundedBox
        args={[0.56, 0.58, 0.08]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.86, 0.26]}
        rotation={[-0.1, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={cushion} roughness={0.7} />
      </RoundedBox>
      {CHAIR_LEGS.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.2, z]}
          geometry={LEG_GEO}
          material={LEG_MAT}
          castShadow
        />
      ))}
    </group>
  );
}

/* ============ Table ============ */
function Table({
  data,
  state,
  area,
  onSelect,
}: {
  data: TableData;
  state: TState;
  area: Area;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const clickable = state !== "unavailable";
  const colors = PALETTE[state];
  const isSelected = state === "selected";

  const radius = TABLE_RADIUS[data.seats];
  const chairRadius = radius + 0.62;

  // Smooth scale animation; stops doing work once it has settled
  useFrame((_, delta) => {
    const target = isSelected ? 1.06 : hovered && clickable ? 1.03 : 1;
    const g = group.current;
    const s = g.scale.x;
    if (Math.abs(s - target) < 0.0005) {
      if (s !== target) g.scale.setScalar(target);
      return;
    }
    g.scale.setScalar(THREE.MathUtils.lerp(s, target, Math.min(delta * 12, 1)));
  });

  useEffect(() => () => void (document.body.style.cursor = "auto"), []);

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = clickable ? "pointer" : "not-allowed";
  };
  const out = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const topMaterial = (
    <meshStandardMaterial
      color={colors.top}
      roughness={0.25}
      metalness={0.1}
      emissive={isSelected ? "#ef4444" : "#000000"}
      emissiveIntensity={isSelected ? 0.4 : 0}
    />
  );

  return (
    <group
      ref={group}
      position={[data.x, 0, data.z]}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation();
        if (clickable) onSelect();
      }}
    >
      {/* stone patio slab under each outdoor table */}
      {area === "outdoor" && (
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <cylinderGeometry
            args={[chairRadius + 0.4, chairRadius + 0.4, 0.02, 48]}
          />
          <meshStandardMaterial color="#8d867c" roughness={0.95} />
        </mesh>
      )}

      {(isSelected || (hovered && clickable)) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[chairRadius + 0.45, chairRadius + 0.6, 64]} />
          <meshBasicMaterial
            color={isSelected ? "#ef4444" : "#ffffff"}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {data.shape === "round" ? (
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, 0.06, 48]} />
          {topMaterial}
        </mesh>
      ) : (
        <RoundedBox
          args={[radius * 1.8, 0.06, radius * 1.8]}
          radius={0.04}
          smoothness={4}
          position={[0, 0.75, 0]}
          castShadow
          receiveShadow
        >
          {topMaterial}
        </RoundedBox>
      )}

      {/* pedestal + base */}
      <mesh position={[0, 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.74, 16]} />
        <meshStandardMaterial color="#121212" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.06, 24]} />
        <meshStandardMaterial color="#121212" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* candle */}
      <mesh position={[0, 0.83, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
        <meshStandardMaterial color="#fafaf9" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#f59e0b"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>

      {Array.from({ length: data.seats }).map((_, i) => {
        const a =
          (i / data.seats) * Math.PI * 2 +
          (data.shape === "square" ? Math.PI / 4 : 0);
        return (
          <Chair
            key={i}
            angle={a}
            cushion={colors.cushion}
            position={[Math.sin(a) * chairRadius, 0, Math.cos(a) * chairRadius]}
          />
        );
      })}

      <Label
        text={`${data.label} · ${data.seats} seats`}
        state={state}
        position={[0, 2.1, 0]}
      />
    </group>
  );
}

/* ============ Plant ============ */
function Plant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.28, 0.7, 16]} />
        <meshStandardMaterial color="#292524" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.48, 16, 16]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
      <mesh position={[0.22, 1.35, 0.1]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#166534" roughness={0.85} />
      </mesh>
      <mesh position={[-0.22, 1.25, -0.1]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ============ String lights (one instanced mesh per strand) ============ */
type V3 = [number, number, number];

function StringLights({
  from,
  to,
  sag = 0.5,
  count = 20,
}: {
  from: V3;
  to: V3;
  sag?: number;
  count?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      m.setPosition(
        THREE.MathUtils.lerp(from[0], to[0], t),
        THREE.MathUtils.lerp(from[1], to[1], t) - sag * 4 * t * (1 - t),
        THREE.MathUtils.lerp(from[2], to[2], t),
      );
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [from, to, sag, count]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshStandardMaterial
        color="#fef08a"
        emissive="#f59e0b"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// Strand data lives outside the component so references stay stable
const POST_X = 9.6;
const POST_Z_BACK = CENTER_Z - 6.6;
const POST_Z_FRONT = CENTER_Z + 6.4;
const LIGHT_Y = 3.3;

const POSTS: [number, number][] = [
  [-POST_X, POST_Z_BACK],
  [POST_X, POST_Z_BACK],
  [-POST_X, POST_Z_FRONT],
  [POST_X, POST_Z_FRONT],
];

const STRANDS: { from: V3; to: V3; count: number }[] = [
  {
    from: [-POST_X, LIGHT_Y, POST_Z_BACK],
    to: [POST_X, LIGHT_Y, POST_Z_BACK],
    count: 28,
  },
  {
    from: [-POST_X, LIGHT_Y, POST_Z_FRONT],
    to: [POST_X, LIGHT_Y, POST_Z_FRONT],
    count: 28,
  },
  {
    from: [-POST_X, LIGHT_Y, POST_Z_BACK],
    to: [-POST_X, LIGHT_Y, POST_Z_FRONT],
    count: 20,
  },
  {
    from: [POST_X, LIGHT_Y, POST_Z_BACK],
    to: [POST_X, LIGHT_Y, POST_Z_FRONT],
    count: 20,
  },
];

const CITY = [
  [-28, 7, 4],
  [-22, 10, 5],
  [-16, 6, 4],
  [-10, 9, 5],
  [-3, 5, 4],
  [4, 11, 5],
  [11, 6, 4],
  [17, 9, 5],
  [24, 7, 4],
  [30, 10, 5],
];

const WINDOW_X = [-5, 0, 5];

/* ============ Lighting (single source of truth) ============ */
function Lighting({ area }: { area: Area }) {
  if (area === "indoor") {
    return (
      <>
        <hemisphereLight args={["#ffeedd", "#171412", 0.4]} />
        <ambientLight color="#ffd6ae" intensity={0.25} />
        <pointLight
          position={[-5, 3.6, -3]}
          intensity={32}
          color="#ffcf99"
          distance={14}
          decay={2}
        />
        <pointLight
          position={[5, 3.6, -3]}
          intensity={32}
          color="#ffcf99"
          distance={14}
          decay={2}
        />
        <pointLight
          position={[0, 3.6, 2]}
          intensity={28}
          color="#ffd9a8"
          distance={14}
          decay={2}
        />
        <directionalLight
          position={[0, 7, 5]}
          intensity={0.5}
          color="#ffe2bf"
        />
      </>
    );
  }

  return (
    <>
      <hemisphereLight args={["#cfe0ff", "#3d4a2b", 1.0]} />
      <ambientLight color="#ffe6c4" intensity={0.35} />
      <directionalLight
        position={[-8, 9, -10]}
        intensity={2.0}
        color="#ffd2a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <pointLight
        position={[0, 4.5, CENTER_Z]}
        intensity={20}
        color="#ffd9a8"
        distance={16}
        decay={2}
      />
      <pointLight
        position={[-6.5, 3.2, CENTER_Z + 2]}
        intensity={12}
        color="#ffcf99"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[6.5, 3.2, CENTER_Z + 2]}
        intensity={12}
        color="#ffcf99"
        distance={10}
        decay={2}
      />
    </>
  );
}

/* ============ Wall that hides when the camera is behind it ============ */
function CullableWall({
  axis,
  sign,
  children,
}: {
  axis: "x" | "z";
  sign: 1 | -1;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ camera }) => {
    const c = axis === "x" ? camera.position.x : camera.position.z;
    // the camera is on this wall's outer side -> it would block the view
    ref.current.visible = sign * c < 3;
  });
  return <group ref={ref}>{children}</group>;
}

/* ============ Environment (geometry only, no lights) ============ */
function Environment3D({ area }: { area: Area }) {
  const floorTex = useFloorTexture(area);

  if (area === "indoor") {
    return (
      <>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, CENTER_Z]}
          receiveShadow
        >
          <planeGeometry args={[ROOM_W, ROOM_D]} />
          <meshStandardMaterial
            map={floorTex}
            roughness={0.55}
            metalness={0.05}
          />
        </mesh>

        {/* walls (each one hides itself when the camera is behind it) */}
        <CullableWall axis="z" sign={-1}>
          <mesh position={[0, 2.2, CENTER_Z - ROOM_D / 2]} receiveShadow>
            <boxGeometry args={[ROOM_W, 4.4, 0.2]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </CullableWall>
        {([-1, 1] as const).map((side) => (
          <CullableWall key={side} axis="x" sign={side}>
            <mesh position={[side * (ROOM_W / 2), 2.2, CENTER_Z]} receiveShadow>
              <boxGeometry args={[0.2, 4.4, ROOM_D]} />
              <meshStandardMaterial color="#171412" roughness={0.9} />
            </mesh>
          </CullableWall>
        ))}

        {/* windows (on the back wall, so they hide with it) */}
        <CullableWall axis="z" sign={-1}>
          {WINDOW_X.map((x) => (
            <group key={x} position={[x, 2.2, CENTER_Z - 6.85]}>
              <mesh>
                <boxGeometry args={[3.4, 2.4, 0.1]} />
                <meshStandardMaterial color="#111111" roughness={0.5} />
              </mesh>
              {/* glass sits IN FRONT of the frame box (it was hidden inside it before) */}
              <mesh position={[0, 0, 0.052]}>
                <planeGeometry args={[3.0, 2.0]} />
                <meshStandardMaterial
                  color="#0f172a"
                  emissive="#3b82f6"
                  emissiveIntensity={0.5}
                  roughness={0.1}
                />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.06, 2.0, 0.02]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[3.0, 0.06, 0.02]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
            </group>
          ))}
        </CullableWall>

        <Plant position={[-9, 0, CENTER_Z - 6]} scale={1.2} />
        <Plant position={[9, 0, CENTER_Z - 6]} scale={1.2} />
        <Plant position={[-9, 0, CENTER_Z + 5]} />
        <Plant position={[9, 0, CENTER_Z + 5]} />
      </>
    );
  }

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[-60, 18, -100]}
        turbidity={6}
        rayleigh={1.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />
      {/* grass beyond the terrace */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -20]}>
        <planeGeometry args={[200, 80]} />
        <meshStandardMaterial color="#2c5230" roughness={1} />
      </mesh>
      {CITY.map(([x, h, w], i) => (
        <mesh key={i} position={[x, h / 2, -26 - (i % 3) * 3]}>
          <boxGeometry args={[w, h, 4]} />
          <meshStandardMaterial color="#3b3550" />
        </mesh>
      ))}

      {/* lawn */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, CENTER_Z]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial map={floorTex} roughness={1} />
      </mesh>

      {/* hedges around the terrace (front side stays open for the camera) */}
      <RoundedBox
        args={[ROOM_W + 0.8, 1.1, 0.9]}
        radius={0.3}
        smoothness={3}
        position={[0, 0.55, CENTER_Z - ROOM_D / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1f4a2a" roughness={1} />
      </RoundedBox>
      {[-ROOM_W / 2, ROOM_W / 2].map((x) => (
        <RoundedBox
          key={x}
          args={[0.9, 1.1, ROOM_D]}
          radius={0.3}
          smoothness={3}
          position={[x, 0.55, CENTER_Z]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#1f4a2a" roughness={1} />
        </RoundedBox>
      ))}

      <Plant position={[-8.8, 0, CENTER_Z - 5.8]} scale={1.2} />
      <Plant position={[8.8, 0, CENTER_Z - 5.8]} scale={1.2} />
      <Plant position={[-8.8, 0, CENTER_Z + 5.5]} />
      <Plant position={[8.8, 0, CENTER_Z + 5.5]} />

      {POSTS.map(([x, z], i) => (
        <mesh key={i} position={[x, 1.7, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 3.4, 8]} />
          <meshStandardMaterial color="#1c1410" />
        </mesh>
      ))}
      {STRANDS.map((s, i) => (
        <StringLights key={i} from={s.from} to={s.to} count={s.count} />
      ))}
    </>
  );
}

/* ============ Responsive camera ============ */
type OrbitLike = {
  target: THREE.Vector3;
  minDistance: number;
  maxDistance: number;
  update: () => void;
};

type ViewMode = "portrait" | "square" | "wide";

const DEG = Math.PI / 180;

// Direction from the orbit target to the camera
function viewDir(elevationDeg: number, azimuthDeg: number) {
  const el = elevationDeg * DEG;
  const az = azimuthDeg * DEG;
  return new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    Math.cos(az) * Math.cos(el),
  );
}

const VIEWS: Record<ViewMode, { fov: number; dir: THREE.Vector3 }> = {
  // Phones: look at the room from a diagonal angle (not straight side-on),
  // tilted steeper so the long side of the room runs up the tall screen.
  portrait: { fov: 55, dir: viewDir(58, 90) },
  // Tablets / small windows
  square: { fov: 48, dir: viewDir(47, 0) },
  // Desktop: the original front view
  wide: { fov: 42, dir: viewDir(47, 0) },
};

// Width (in meters) that must fit on screen in portrait mode
const PORTRAIT_FIT_WIDTH = 16.5;

function viewDistance(mode: ViewMode, aspect: number) {
  if (mode === "wide") return 18;
  if (mode === "square") return 19.5;
  const halfFov = (VIEWS.portrait.fov / 2) * DEG;
  const d = PORTRAIT_FIT_WIDTH / (2 * Math.tan(halfFov) * aspect);
  return THREE.MathUtils.clamp(d, 17, 28);
}

/* The camera, controls and canvas are mutable three.js objects by design,
   so the React Compiler "immutability" lint rule does not apply here. */
/* eslint-disable react-hooks/immutability */
function ResponsiveRig() {
  const get = useThree((s) => s.get);
  const ready = useThree((s) => Boolean(s.controls));
  const aspect = useThree((s) => s.size.width / s.size.height);
  const mode: ViewMode =
    aspect < 0.9 ? "portrait" : aspect < 1.35 ? "square" : "wide";

  // Re-frame the camera only when the layout mode changes (not on every
  // pixel of resize), so the user's own zoom is not reset constantly.
  useLayoutEffect(() => {
    if (!ready) return;
    const state = get();
    const cam = state.camera as THREE.PerspectiveCamera;
    const orbit = state.controls as unknown as OrbitLike;
    const view = VIEWS[mode];
    const dist = viewDistance(mode, state.size.width / state.size.height);

    cam.fov = view.fov;
    cam.updateProjectionMatrix();
    cam.position.copy(orbit.target).addScaledVector(view.dir, dist);
    orbit.minDistance = 6;
    orbit.maxDistance = dist + 4;
    orbit.update();
  }, [mode, ready, get]);

  // One-finger vertical swipes scroll the page instead of being trapped by
  // the canvas; sideways swipe rotates, two fingers pinch to zoom.
  useEffect(() => {
    if (!ready) return;
    get().gl.domElement.style.touchAction = "pan-y";
  }, [ready, get]);

  return null;
}
/* eslint-enable react-hooks/immutability */

/* ============ Camera rig ============ */
function CameraRig({ target }: { target: V3 }) {
  const controls = useThree((s) => s.controls) as unknown as {
    target: THREE.Vector3;
  } | null;
  const goal = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    if (!controls) return;
    goal.set(target[0], target[1], target[2]);
    controls.target.lerp(goal, Math.min(delta * 4, 1));
  });
  return null;
}

/* ============ Main export ============ */
export default function TableScene({
  area,
  tables,
  guests,
  selectedId,
  onSelect,
}: TableSceneProps) {
  const selected = tables.find((t) => t.id === selectedId);
  const rigTarget: V3 = selected
    ? [selected.x * 0.5, 0, CENTER_Z + (selected.z - CENTER_Z) * 0.5]
    : [0, 0, CENTER_Z];

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 15, 13], fov: 42 }}
    >
      {area === "indoor" && <color attach="background" args={["#0c0a09"]} />}
      <fog
        attach="fog"
        args={[area === "indoor" ? "#0c0a09" : "#b09a84", 28, 80]}
      />

      <Lighting area={area} />
      <Environment3D area={area} />

      {tables.map((t) => {
        const unavailable = t.reserved || t.seats < guests;
        const state: TState =
          t.id === selectedId
            ? "selected"
            : unavailable
              ? "unavailable"
              : "available";
        return (
          <Table
            key={`${area}-${t.id}`}
            data={t}
            state={state}
            area={area}
            onSelect={() => onSelect(t.id)}
          />
        );
      })}

      <ContactShadows
        position={[0, area === "indoor" ? 0.02 : 0.03, CENTER_Z]}
        opacity={area === "indoor" ? 0.5 : 0.28}
        scale={22}
        blur={2.5}
        far={4}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.3}
      />
      <ResponsiveRig />
      <CameraRig target={rigTarget} />
    </Canvas>
  );
}
