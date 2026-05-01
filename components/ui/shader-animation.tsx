"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type SceneState = {
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  uniforms: {
    time: { value: number };
    resolution: { value: THREE.Vector2 };
    color: { value: THREE.Color };
    intensity: { value: number };
    baseColor: { value: THREE.Color };
  };
  animationId: number;
};

export function ShaderAnimation({ startDelayMs = 0 }: { startDelayMs?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let disposed = false;
    let canAnimate = startDelayMs === 0;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec3 color;
      uniform float intensity;
      uniform vec3 baseColor;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.06;
        float lineWidth = 0.0025;

        float shape = 0.0;
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            shape += lineWidth * float(i * i) /
              abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }

        vec3 glow = color * shape * intensity;
        gl_FragColor = vec4(glow, shape * intensity);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms: SceneState["uniforms"] = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2() },
      color: { value: new THREE.Color("#0033ff") },
      intensity: { value: 0.0 },
      baseColor: { value: new THREE.Color("#020617") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };

    const animate = () => {
      if (disposed || !sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);
      if (canAnimate) {
        uniforms.time.value += 0.05;
        if (uniforms.intensity.value < 1) {
          uniforms.intensity.value = Math.min(uniforms.intensity.value + 0.02, 1);
        }
      }
      renderer.render(scene, camera);
    };

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    const delayTimer =
      startDelayMs > 0
        ? window.setTimeout(() => {
            canAnimate = true;
          }, startDelayMs)
        : null;

    animate();

    return () => {
      disposed = true;
      if (delayTimer) window.clearTimeout(delayTimer);
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
      }

      geometry.dispose();
      material.dispose();
      sceneRef.current = null;
    };
  }, [startDelayMs]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{
        background: "transparent",
        overflow: "hidden",
      }}
    />
  );
}
