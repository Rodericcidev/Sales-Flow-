"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ExtrudeGeometry, Shape } from "three";

/** ---------- 3D BACKGROUND ---------- */

function RoundedBoxGeometry() {
  return useMemo(() => {
    const shape = new Shape();
    const angleStep = Math.PI * 0.5;
    const radius = 1;

    // rounded rectangle using 4 arcs
    shape.absarc(2, 2, radius, angleStep * 0, angleStep * 1);
    shape.absarc(-2, 2, radius, angleStep * 1, angleStep * 2);
    shape.absarc(-2, -2, radius, angleStep * 2, angleStep * 3);
    shape.absarc(2, -2, radius, angleStep * 3, angleStep * 4);

    const extrudeSettings = {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 12,
      curveSegments: 18,
    };

    const g = new ExtrudeGeometry(shape, extrudeSettings);
    g.center();
    return g;
  }, []);
}

function Box({
  geometry,
  position,
  rotation,
}: {
  geometry: ExtrudeGeometry;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
      <meshPhysicalMaterial
        color="#161616"
        metalness={1}
        roughness={0.22}
        reflectivity={0.65}
        ior={1.35}
        clearcoat={0.18}
        clearcoatRoughness={0.2}
        iridescence={0.55}
        iridescenceIOR={1.25}
        iridescenceThicknessRange={[80, 260]}
      />
    </mesh>
  );
}

function AnimatedBoxes({ count = 42 }: { count?: number }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const geometry = RoundedBoxGeometry();

  const boxes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        position: [(i - count / 2) * 0.78, 0, 0] as [number, number, number],
        rotation: [((i - 10) * 0.1) as number, Math.PI / 2, 0] as [
          number,
          number,
          number
        ],
      })),
    [count]
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // slow premium rotation
    groupRef.current.rotation.x += delta * 0.045;
    groupRef.current.rotation.y += delta * 0.028;

    // subtle float
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {boxes.map((b) => (
        <Box
          key={b.id}
          geometry={geometry}
          position={b.position}
          rotation={b.rotation}
        />
      ))}
    </group>
  );
}

function SceneBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [5, 5, 20], fov: 40 }}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[10, 10, 5]} intensity={2.2} />
        <pointLight position={[-8, 6, 10]} intensity={1.4} />
        <AnimatedBoxes />
      </Canvas>

      {/* Overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.88), rgba(255,255,255,0.74), rgba(255,255,255,0.92))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/** ---------- UI (NO TAILWIND, 100% INLINE) ---------- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.65)",
        padding: "8px 12px",
        fontSize: 13,
        color: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </span>
  );
}

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      setStatus("success");
      setMsg("You’re on the waitlist. We’ll email you when early access opens.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message || "Please try again.");
    }
  }

  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      <SceneBackground />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "84px 20px 70px",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <Pill>Sales Flow • Simple follow-up system (not a CRM)</Pill>

          <h1
            style={{
              margin: "18px 0 0",
              fontSize: 56,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: "#0c0c0c",
            }}
          >
            Stop losing deals because you forgot to follow up.
          </h1>

          <p
            style={{
              margin: "18px 0 0",
              fontSize: 18,
              lineHeight: 1.6,
              color: "rgba(0,0,0,0.70)",
            }}
          >
            Sales Flow gives you one clear plan every day: who to contact, what to say,
            and what’s at risk if you don’t. Built for B2B teams that want action —
            not complexity.
          </p>

          <ul
            style={{
              margin: "22px 0 0",
              padding: 0,
              listStyle: "none",
              display: "grid",
              gap: 10,
              color: "rgba(0,0,0,0.82)",
              fontSize: 16,
            }}
          >
            <li>✅ Get more sales with consistent follow-up</li>
            <li>✅ Keep more clients by staying on top of relationships</li>
            <li>✅ Win back old customers with smart reminders</li>
            <li>✅ Turn your pipeline into a daily action list</li>
          </ul>

          <div
            style={{
              marginTop: 26,
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.10)",
              background: "rgba(255,255,255,0.70)",
              padding: 14,
              backdropFilter: "blur(12px)",
            }}
          >
            <form
              onSubmit={onSubmit}
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to join the waitlist"
                style={{
                  flex: "1 1 280px",
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                  padding: "0 14px",
                  fontSize: 15,
                  outline: "none",
                  background: "#fff",
                }}
              />

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  height: 46,
                  padding: "0 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "#0b0b0b",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                }}
              >
                {status === "loading" ? "Joining..." : "Join the waitlist"}
              </button>
            </form>

            <p
              style={{
                margin: "10px 2px 0",
                fontSize: 13,
                color:
                  status === "success"
                    ? "rgba(5,150,105,1)"
                    : status === "error"
                    ? "rgba(220,38,38,1)"
                    : "rgba(0,0,0,0.55)",
              }}
            >
              {msg || "No spam. Just one email when early access opens."}
            </p>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              color: "rgba(0,0,0,0.62)",
              fontSize: 13,
            }}
          >
            <Pill>⚡ Fast setup</Pill>
            <Pill>🧠 Daily clarity</Pill>
            <Pill>🔒 Built for B2B</Pill>
          </div>
        </div>
      </section>
    </main>
  );
}
