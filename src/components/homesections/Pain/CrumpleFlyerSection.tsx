"use client";

/**
 * CrumpleFlyerSection
 * Section Next.js (App Router): pamflet 3D yang diremas saat disentuh,
 * dilempar ke tong sampah, lalu muncul lagi.
 *
 * Dependensi:  npm i three gsap  &&  npm i -D @types/three
 * Pemakaian:   <CrumpleFlyerSection />  (di dalam page/section mana pun)
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { BrochurePoints, PainPoints } from '@/i18n/types';


/* ============ TEKSTUR PAMFLET (canvas 2D) ============ */
function wrapText(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y);
      line = word;
      y += lh;
    } else line = test;
  }
  g.fillText(line, x, y);
  return y;
}

function makeFlyerTexture({headline, intro, points}: {headline:string; intro:string, points: BrochurePoints[]}) {
  const w = 800, h = 1130; // rasio sama dengan bidang 4.2 x 5.9
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  const sans = "'Helvetica Neue', Arial, sans-serif";

  g.fillStyle = "#f6efe0"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#d9503f"; g.fillRect(0, 0, w, 330);

  g.fillStyle = "#f6efe0"; g.textAlign = "center";
  g.font = `bold 58px ${sans}`;
  wrapText(g, headline, w / 2, 120, 700, 70);

  g.fillStyle = "#2b2f3a"; g.font = `28px ${sans}`;
  wrapText(g, intro, w / 2, 400, 660, 38);

  points.forEach((p, i) => {
    const y = 535 + i * 190;
    g.fillStyle = "#d9503f"; g.beginPath(); g.arc(85, y - 10, 34, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f6efe0"; g.font = `bold 36px ${sans}`; g.textAlign = "center";
    g.fillText(String(i + 1), 85, y + 3);

    g.textAlign = "left";
    g.fillStyle = "#d9503f"; g.font = `bold 33px ${sans}`;
    g.fillText(p.title, 145, y);
    g.fillStyle = "#2b2f3a"; g.font = `25px ${sans}`;
    wrapText(g, p.body, 145, y + 42, 620, 33);

    if (i < 2) { g.fillStyle = "rgba(0,0,0,.1)"; g.fillRect(50, y + 140, w - 100, 2); }
  });

  g.fillStyle = "#d9503f"; g.fillRect(0, h - 18, w, 18);
  g.strokeStyle = "rgba(0,0,0,.08)"; g.setLineDash([8, 8]); // garis lipatan tri-fold
  [w / 3, (2 * w) / 3].forEach((x) => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ============ NOISE RINGAN ============ */
const noise3 = (x: number, y: number, z: number) =>
  Math.sin(x * 1.7 + z * 0.9) * Math.cos(y * 2.3 - z * 1.1) * 0.5 +
  Math.sin(x * 4.1 - y * 3.7 + z * 2.2) * 0.25 +
  Math.sin(x * 9.3 + y * 8.1 + z * 5.5) * 0.125;
const triWave = (v: number) => Math.abs((((v % 2) + 2) % 2) - 1);
const smooth = (t: number) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };

/* ============ KOMPONEN ============ */
type Props = {
  /** Warna latar section. Default transparan; isi mis. "#0f131b" untuk latar solid. */
  background?: string;
  /** Warna teks hint di bawah. Ubah jadi gelap jika latar halaman terang. */
  hintColor?: string;
  brochure: {
    headline: string;
    intro: string;
    points: BrochurePoints[]
  }
};

export default function CrumpleFlyerSection({ background = "transparent", hintColor = "#ece8df", brochure }: Props) {
  const {headline, intro, points} = brochure
  const wrapRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = wrapRef.current!;
    let w = el.clientWidth, h = el.clientHeight;

    /* ---- scene dasar ---- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.domElement.style.touchAction = "pan-y"; // scroll halaman tetap jalan di mobile
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x9aa7bb, 1.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 7, 9); scene.add(key);
    const rim = new THREE.DirectionalLight(0xf0a35e, 1.2); rim.position.set(-6, -2, -3); scene.add(rim);

    /* ---- mesh pamflet + morph target ---- */
    const W = 4.2, H = 5.9, BALL_R = 1.1;
    const geo = new THREE.PlaneGeometry(W, H, 44, 60);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const crumpled = new Float32Array(pos.count * 3);
    const d = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i) / W, ny = pos.getY(i) / H;
      // State 1: bungkus bidang ke bola (lon/lat) + radius berlipat tajam
      const lon = (nx + 0.5) * Math.PI * 2, lat = ny * Math.PI * 0.98;
      d.set(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
      const crease = 1 - Math.abs(noise3(d.x * 3.2, d.y * 3.2, d.z * 3.2));
      const fine = noise3(d.x * 8, d.y * 8, d.z * 8);
      d.multiplyScalar(BALL_R * (0.78 + 0.32 * crease + 0.12 * fine));
      crumpled.set([d.x, d.y, d.z], i * 3);
      // State 0: lembar tri-fold bergelombang halus
      pos.setZ(i, (triWave((nx + 0.5) * 3) - 0.5) * 0.28);
    }
    pos.needsUpdate = true;
    geo.morphAttributes.position = [new THREE.BufferAttribute(crumpled, 3)];
    const map = makeFlyerTexture({headline, intro, points});
    const mat = new THREE.MeshStandardMaterial({ map, roughness: 0.8, side: THREE.DoubleSide, flatShading: true });
    const flyer = new THREE.Mesh(geo, mat);
    flyer.updateMorphTargets(); // pastikan morphTargetInfluences terbentuk
    if (!flyer.morphTargetInfluences) flyer.morphTargetInfluences = [0];
    scene.add(flyer);

    /* ---- tong sampah ---- */
    const BIN_H = 2.4, BIN_R = 1.15;
    const bin = new THREE.Group();
    bin.add(new THREE.Mesh(
      new THREE.CylinderGeometry(BIN_R, BIN_R * 0.78, BIN_H, 32, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x56657a, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide })
    ));
    const floor = new THREE.Mesh(new THREE.CircleGeometry(BIN_R * 0.78, 32), new THREE.MeshStandardMaterial({ color: 0x232a35 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -BIN_H / 2 + 0.02; bin.add(floor);
    const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(BIN_R, 0.09, 10, 40), new THREE.MeshStandardMaterial({ color: 0x8798b0, roughness: 0.4, metalness: 0.5 }));
    rimMesh.rotation.x = Math.PI / 2; rimMesh.position.y = BIN_H / 2; bin.add(rimMesh);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x3f4c5f });
    // for (let i = -2; i <= 2; i++) {
    //   const a = i * 0.42;
    //   const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, BIN_H * 0.85, 0.05), ribMat);
    //   rib.position.set(Math.sin(a) * BIN_R * 0.93, 0, Math.cos(a) * BIN_R * 0.93); rib.rotation.y = a; bin.add(rib);
    // }
    scene.add(bin);

    /* ---- layout responsif terhadap ukuran SECTION (bukan window) ---- */
    const home = new THREE.Vector3();
    let busy = false;
    const layout = () => {
      const aspect = w / h, portrait = aspect < 0.9;
      camera.position.set(0, 1.2, portrait ? 17 : 10.5);
      camera.lookAt(0, -0.2, 0);
      const halfW = Math.tan(THREE.MathUtils.degToRad(22.5)) * camera.position.z * aspect;
      if (portrait) { home.set(0, 1.8, 0); bin.position.set(0, -4.6, 0); }
      else {
        const bx = Math.min(4.3, halfW - 1.7);
        bin.position.set(bx, -2.7, 0); home.set(-bx * 0.55, 0.3, 0);
      }
      if (!busy) flyer.position.copy(home);
    };

    /* ---- proximity: kursor -> pusat pamflet ---- */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(10, 10);
    const pickPlane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(pickPlane);
    const OUTER_RADIUS = 4.5, INNER_RADIUS = 1.2, HOVER_MAX = 0.4;

    /**
     * Jarak kursor -> pusat objek:
     * 1) ray kamera lewat posisi mouse (NDC) dipotongkan ke bidang z=0 (sebidang objek)
     * 2) hitung jarak titik potong ke pusat pamflet (flyer.position)
     * 3) >= outerRadius -> 0, <= innerRadius -> 1, di antaranya smoothstep 0..1
     */
    const proximityFactor = () => {
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(pickPlane)[0];
      if (!hit) return 0;
      const dist = hit.point.distanceTo(flyer.position);
      if (dist >= OUTER_RADIUS) return 0;
      if (dist <= INNER_RADIUS) return 1;
      return smooth((OUTER_RADIUS - dist) / (OUTER_RADIUS - INNER_RADIUS));
    };

    /* ---- sekuens: remas -> lempar -> muncul lagi ---- */
    const state = { influence: 0 };
    let hoverInf = 0;
    let tl: gsap.core.Timeline | null = null;
    const say = (t: string) => { if (msgRef.current) msgRef.current.textContent = t; };
    const HINT = "Sentuh / klik brosurnya";

    const respawn = () => {
      state.influence = 0; hoverInf = 0;
      flyer.position.copy(home); flyer.position.y += 3;
      flyer.rotation.set(0, Math.PI, 0); flyer.scale.setScalar(0.001); flyer.visible = true;
      tl = gsap.timeline({ onComplete: () => { busy = false; say(HINT); } })
        .to(flyer.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "back.out(1.8)" })
        .to(flyer.position, { y: home.y, duration: 0.9, ease: "bounce.out" }, "<")
        .to(flyer.rotation, { y: 0, duration: 0.9, ease: "power3.out" }, "<");
    };

    const throwAway = () => {
      if (busy) return;
      busy = true; say("Diremas...");
      state.influence = hoverInf;
      const { x: bx, y: by } = bin.position;
      const rimY = by + BIN_H / 2;
      const apex = Math.max(flyer.position.y, rimY) + 2.6;
      tl = gsap.timeline({ onComplete: respawn })
        .to(state, { influence: 1, duration: 0.8, ease: "power2.in" })
        .to(flyer.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 0.8, ease: "power2.in" }, "<")
        .to(flyer.rotation, { z: 0.5, y: 0, duration: 0.8, ease: "sine.inOut" }, "<")
        .addLabel("throw", "+=0.1")
        .call(() => say("Dibuang!"), undefined, "throw")
        .to(flyer.position, { x: bx, duration: 0.95, ease: "power1.inOut" }, "throw")
        .to(flyer.position, { y: apex, duration: 0.45, ease: "power2.out" }, "throw")
        .to(flyer.position, { y: rimY + 0.1, duration: 0.5, ease: "power2.in" }, "throw+=0.45")
        .to(flyer.rotation, { x: "+=7", z: "+=5", duration: 0.95, ease: "none" }, "throw")
        .to(flyer.position, { y: by - 0.5, duration: 0.3, ease: "power1.in" })
        .to(bin.scale, { x: 1.08, y: 0.9, duration: 0.09, yoyo: true, repeat: 1, ease: "power1.out" }, "<")
        .to(bin.rotation, { z: 0.07, duration: 0.08, yoyo: true, repeat: 3, ease: "sine.inOut" }, "<")
        .set(flyer, { visible: false })
        .call(() => say("Brosur baru datang..."), undefined, "+=0.2");
    };

    /* ---- loop: lerp + inersia, jeda saat section di luar layar ---- */
    const clock = new THREE.Timer();
    const LERP = 5;
    let inView = true, raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.getElapsed();
      if (!inView) return;
      const infl = flyer.morphTargetInfluences!;
      if (!busy) {
        hoverInf += (proximityFactor() * HOVER_MAX - hoverInf) * (1 - Math.exp(-LERP * dt));
        infl[0] = hoverInf;
        flyer.rotation.y = Math.sin(t * 0.8) * 0.1;
        flyer.rotation.x = Math.sin(t * 0.6) * 0.03;
      } else infl[0] = state.influence;
      renderer.render(scene, camera);
    };

    /* ---- event (relatif terhadap section) ---- */
    const setMouse = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(); // koordinat relatif terhadap section, bukan window
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const overFlyer = () => { raycaster.setFromCamera(mouse, camera); return raycaster.intersectObject(flyer).length > 0; };
    const onMove = (e: PointerEvent) => { setMouse(e); el.style.cursor = !busy && overFlyer() ? "pointer" : "default"; };
    const onDown = (e: PointerEvent) => {
      setMouse(e);
      if (!busy && Math.abs(mouse.x) <= 1 && Math.abs(mouse.y) <= 1 && overFlyer()) throwAway();
    };
    const onLeave = () => mouse.set(10, 10);
    // Dipasang di window supaya tetap bereaksi walau ada elemen lain yang menimpa section
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("mouseleave", onLeave);

    const ro = new ResizeObserver(() => {
      w = el.clientWidth; h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h); layout();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; });
    io.observe(el);

    layout();
    flyer.scale.setScalar(0.001);
    gsap.to(flyer.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1,.7)", delay: 0.2 });
    loop();

    /* ---- cleanup ---- */
    return () => {
      cancelAnimationFrame(raf);
      tl?.kill();
      gsap.killTweensOf([flyer.scale, flyer.position, flyer.rotation, bin.scale, bin.rotation, state]);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
      });
      map.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const sr: React.CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

  return (
    <div className="-m-10" style={{ position: "relative", minHeight: "100svh", background, overflow: "hidden" }}>
      {/* Teks asli untuk SEO & screen reader (pamflet 3D hanya visual) */}
      <div style={sr}>
        <h2>{headline}</h2>
        <p>{intro}</p>
        {points.map((p) => (
          <div key={p.title}><h3>{p.title}</h3><p>{p.body}</p></div>
        ))}
      </div>

      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", pointerEvents: "none",
        font: "13px system-ui, sans-serif", color: hintColor, opacity: 0.8 }}>
        <span ref={msgRef}>Sentuh / klik brosurnya</span>
      </div>
    </div>
  );
}