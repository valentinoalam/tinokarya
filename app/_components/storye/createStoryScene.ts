import * as T from "three";

type V3 = [number, number, number];
type Ctx = CanvasRenderingContext2D;
type EncodingCompat = { outputColorSpace?: unknown; outputEncoding?: unknown; colorSpace?: unknown; encoding?: unknown };
type Line = { cu: T.CatmullRomCurve3; g1: T.TubeGeometry; g2: T.TubeGeometry; pu: T.Mesh; a: number; b: number; n: number };

export type StoryFonts = { serif: string; sans: string; hand: string };
export type StoryOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  fonts: StoryFonts;
  /** returns scroll progress 0..1 of the whole section */
  getProgress: () => number;
  onStage: (index: number) => void;
  // onLegend: (index: number) => void;
  onError?: () => void;
};

export const STAGE_THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.78, 0.92];
export const LEGEND_THRESHOLDS = [0, 0.2, 0.4, 0.5, 0.6, 0.78];

export function createStoryScene(o: StoryOptions): () => void {
  const F = o.fonts;
  let R: T.WebGLRenderer;
  try {
    R = new T.WebGLRenderer({ canvas: o.canvas, antialias: true, alpha: true });
  } catch (e) {
    o.onError?.();
    return () => {console.error(e)};
  }
  // Compat layer: three r128 (sRGBEncoding) → current (SRGBColorSpace)
  const TL = T as unknown as Record<string, unknown>;
  const MODERN = "outputColorSpace" in R; // three >= r152
  const SRGB: unknown = MODERN ? TL.SRGBColorSpace : TL.sRGBEncoding;
  const doSRGB = (obj: object, isRenderer: boolean) => {
    const k = obj as EncodingCompat;
    if (isRenderer) { if (MODERN) k.outputColorSpace = SRGB; else k.outputEncoding = SRGB; }
    else if ("colorSpace" in obj) k.colorSpace = SRGB; else k.encoding = SRGB;
  };
  const LS = MODERN ? Math.PI : 1; // light intensity compensation (physical lights)
  const PLS = MODERN ? 8 : 1; // point-light compensation — tweak to taste
  R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  doSRGB(R, true);
  R.toneMapping = T.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.12;
  R.shadowMap.enabled = true;
  R.shadowMap.type = T.PCFShadowMap;

  const sc = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, 0.5, 200);
  sc.add(new T.HemisphereLight(0xfff4e6, 0x8b8378, 0.95 * LS));
  const sun = new T.DirectionalLight(0xfff0dc, 1.6 * LS);
  sun.position.set(2, 18, 11); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  const sh = sun.shadow.camera; sh.left = -26; sh.right = 26; sh.top = 26; sh.bottom = -26; sh.near = 1; sh.far = 60;
  sun.shadow.bias = -0.0004; sun.shadow.radius = 3; sun.target.position.set(0, 0, -6); sc.add(sun, sun.target);

  const AC = 0xd9622b, FL = 0.08;
  const M = (c: number, r = 0.8, mt = 0, op: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: mt }, op));
  const m = {
    wood: M(0xb68a5b, .7), dw: M(0x6f4f33, .65), conc: M(0xd6d0c4, .95), pave: M(0xe6e1d7, .95), road: M(0x38383a, .9),
    ch: M(0x2c2c2f, .5, .3), off: M(0xf2eee6, .85), gray: M(0xa5a39e, .7), metal: M(0xc4c4c2, .3, .9), card: M(0xc8a06b, .92),
    acc: M(AC, .55), fl: M(0xcbb690, .8), glass: M(0xc6d3cf, .06, .2, { transparent: true, opacity: .2 }),
    lamp: M(0xfff1d6, .5, 0, { emissive: 0xffd49a, emissiveIntensity: 1.3 }), led: M(AC, .4, 0, { emissive: AC, emissiveIntensity: 1.6 }),
  };

  /* ---- helpers ---- */
  const TX: Array<() => void> = [];
  function CT(w: number, h: number, f: (x: Ctx, w: number, h: number) => void) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d") as Ctx; const t = new T.CanvasTexture(c);
    doSRGB(t, false);
    t.anisotropy = 8;
    const r = () => { f(x, w, h); t.needsUpdate = true; };
    r(); TX.push(r); return { t, r, x };
  }
  const TXT = (s: string, bg: string, fg: string, font: string, w = 512, h = 128) => CT(w, h, (x) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = font; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(s, w / 2, h / 2); }).t;
  const B = (p: T.Object3D, w: number, h: number, d: number, mat: T.Material, x: number, y: number, z: number) => { const q = new T.Mesh(new T.BoxGeometry(w, h, d), mat); q.position.set(x, y + h / 2, z); q.castShadow = q.receiveShadow = true; p.add(q); return q; };
  const C = (p: T.Object3D, r: number, h: number, mat: T.Material, x: number, y: number, z: number, r2?: number) => { const q = new T.Mesh(new T.CylinderGeometry(r2 == null ? r : r2, r, h, 22), mat); q.position.set(x, y + h / 2, z); q.castShadow = q.receiveShadow = true; p.add(q); return q; };
  const GL = (p: T.Object3D, w: number, h: number, d: number, x: number, y: number, z: number) => { const q = B(p, w, h, d, m.glass, x, y, z); q.castShadow = false; return q; };
  const G = (par?: T.Object3D) => { const g = new T.Group(); (par || sc).add(g); return g; };
  const PL = (p: T.Object3D, w: number, h: number, tex: T.Texture, x: number, y: number, z: number, ry = 0, em = 0) => { const q = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tex, roughness: .55, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: em })); q.position.set(x, y, z); q.rotation.y = ry; p.add(q); return q; };
  const fin = (g: T.Object3D) => { g.children.forEach((c) => { c.userData.b = c.position.clone(); }); return g; };
  const PAL = [0xc9774a, 0xe8dcc6, 0x59644f, 0x2b2b2d, 0xb8a589];
  function prod(p: T.Object3D, x: number, y: number, z: number, i: number) { const c = M(PAL[i % 5], .7), k = i % 3; if (k == 0) C(p, .07, .15, c, x, y, z); else if (k == 1) B(p, .15, .19, .09, c, x, y, z); else { C(p, .045, .22, c, x, y, z); C(p, .025, .05, m.ch, x, y + .22, z); } }
  const SK = [0xd9a679, 0xb98259, 0xe0b48b], CL = [0x6b7a6a, 0xa35d3c, 0x3d4650, 0xc9b79c, 0x5a4a3f, 0x8d8f8a];
  function person(p: T.Object3D, x: number, z: number, i: number, ry = 0) {
    const g = G(p); g.position.set(x, 0, z); g.rotation.y = ry; const lm = M(0x2e2d2b);
    B(g, .07, .36, .1, lm, -.06, 0, 0); B(g, .07, .36, .1, lm, .06, 0, 0); C(g, .11, .44, M(CL[i % 6], .85), 0, .34, 0, .085);
    const h = new T.Mesh(new T.SphereGeometry(.095, 16, 12), M(SK[i % 3], .7)); h.position.y = .9; h.castShadow = true; g.add(h);
    const hr = new T.Mesh(new T.SphereGeometry(.1, 16, 12, 0, 6.3, 0, 1.3), M(0x1f1b18, .9)); hr.position.y = .92; hr.castShadow = true; g.add(hr); return g;
  }
  const scr = (txt: string, sub: string, w = 512, h = 320) => CT(w, h, (x) => { x.fillStyle = "#202022"; x.fillRect(0, 0, w, h); x.fillStyle = "#f1ece3"; x.textAlign = "center"; x.textBaseline = "alphabetic"; x.font = `600 46px ${F.sans}`; x.fillText(txt, w / 2, h / 2 - 10); x.fillStyle = "#d9622b"; x.font = `500 30px ${F.sans}`; x.fillText(sub, w / 2, h / 2 + 50); }).t;
  const root = G();
 
  /* ---- ground ---- */
  const gG = G(root);
  B(gG, 64, .5, 46, m.conc, 0, -.5, -8); B(gG, 64, .02, 2.5, m.pave, 0, 0, 3.75); B(gG, 64, .02, 3.5, m.road, 0, 0, 6.75); B(gG, 64, .02, 2.7, m.pave, 0, 0, -8.85); B(gG, 64, .02, 3, m.road, 0, 0, -6);
  for (let x = -27; x <= 27; x += 3) { B(gG, 1.2, .025, .1, m.off, x, 0, 6.75); B(gG, 1.2, .025, .1, m.off, x, 0, -6); }
 
  /* ---- shop (cloned into branches) ---- */
  const shop = G(root), gL = G(shop);
  B(gL, 6, .08, 4, m.fl, 0, 0, .5); B(gL, .15, 1.7, 4, m.off, -3.05, 0, .5); B(gL, 6.2, 1.7, .15, m.off, 0, 0, -1.55);
  B(gL, .2, 2.3, .2, m.gray, -2.9, 0, 2.5); B(gL, .2, 2.3, .2, m.gray, 2.9, 0, 2.5); B(gL, 6, .5, .25, m.off, 0, 2.3, 2.5);
  const st = CT(64, 64, (x) => { x.fillStyle = "#ddd6c6"; x.fillRect(0, 0, 64, 64); x.fillStyle = "#8f9d8e"; x.fillRect(0, 0, 32, 64); });
  st.t.wrapS = T.RepeatWrapping; st.t.repeat.set(7, 1);
  const aw = new T.Mesh(new T.BoxGeometry(6, .06, 1), new T.MeshStandardMaterial({ map: st.t, roughness: .9 })); aw.position.set(0, 2.2, 3); aw.rotation.x = .28; aw.castShadow = true; gL.add(aw);
  PL(gL, 2.4, .4, TXT("Toko Rina", "#efe6d2", "#3b3128", `600 70px ${F.hand}`, 512, 90), 0, 2.55, 2.64);
  B(gL, .6, .8, .05, m.dw, -1.8, 0, 3.2).rotation.y = .3; PL(gL, .5, .62, TXT("Buka!", "#efe6d2", "#3b3128", `600 64px ${F.hand}`, 200, 250), -1.8, .48, 3.23, .3);
  B(gL, 2.2, .5, .8, m.wood, -1.2, FL, 1.2); for (let i = 0; i < 6; i++) prod(gL, -2 + i * .32, FL + .5, 1.2 + (i % 2 ? .15 : -.15), i);
 
  // stage 2a — branded facade
  const gSt = G(shop);
  B(gSt, 6.4, .9, .4, m.ch, 0, 2.8, 2.45); B(gSt, 6.4, .06, .42, m.acc, 0, 2.74, 2.45);
  const logo = CT(512, 128, (x, w, h) => { x.fillStyle = "#2c2c2f"; x.fillRect(0, 0, w, h); x.fillStyle = "#f1ece3"; x.font = `400 76px ${F.serif}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("RINA", 190, 68); x.fillStyle = "#d9622b"; x.fillRect(300, 60, 28, 6); x.fillStyle = "#bdb8ab"; x.font = `500 30px ${F.sans}`; x.fillText("goods", 390, 66); });
  PL(gSt, 2.6, .65, logo.t, 0, 3.25, 2.66, 0, .7);
  GL(gSt, 3.2, 2.0, .04, -1.2, .1, 2.5); B(gSt, 3.2, .05, .08, m.ch, -1.2, .1, 2.5); B(gSt, 3.2, .05, .08, m.ch, -1.2, 2.05, 2.5); B(gSt, .05, 2, .08, m.ch, -1.2, .1, 2.5);
  B(gSt, .06, 2.0, .08, m.ch, .5, .1, 2.5); B(gSt, .06, 2.0, .08, m.ch, 1.9, .1, 2.5); B(gSt, 1.46, .06, .08, m.ch, 1.2, 2.08, 2.5); GL(gSt, 1.34, 2, .03, 1.2, .1, 2.5); B(gSt, .04, .45, .05, m.metal, .65, .9, 2.56);
  [-2.6, 2.7].forEach((x) => { C(gSt, .2, .3, m.ch, x, .02, 3.15, .16); const s = new T.Mesh(new T.SphereGeometry(.22, 14, 10), M(0x5d7355, .9)); s.position.set(x, .5, 3.15); s.castShadow = true; gSt.add(s); });
  [[-2.4, .2], [-1.8, .35], [-1.2, .5]].forEach((a, i) => { B(gSt, .5, a[1], .5, m.off, a[0], FL, 2.1); prod(gSt, a[0], FL + a[1], 2.1, i + 1); });
  fin(gSt);
 
  // stage 2b — interior branding
  const gBr = G(shop), LT: T.PointLight[] = [];
  B(gBr, 3.4, .02, 2.4, M(0xe6dccb, .95), .1, FL, .8); B(gBr, 3.4, .025, .3, M(0xc9774a, .95), .1, FL, .8);
  const sh1 = G(gBr); [.45, .85, 1.25].forEach((y, k) => { B(sh1, .3, .04, 2, m.dw, -2.82, y, .2); for (let j = 0; j < 6; j++) prod(sh1, -2.82, y + .04, -.7 + j * .32, j + k); });
  B(sh1, .3, 1.3, .04, m.dw, -2.82, FL, -.8); B(sh1, .3, 1.3, .04, m.dw, -2.82, FL, 1.2); fin(sh1);
  const story = CT(512, 256, (x, w, h) => { x.fillStyle = "#c9774a"; x.fillRect(0, 0, w, h); x.fillStyle = "#f6efe2"; x.textAlign = "left"; x.textBaseline = "alphabetic"; x.font = `400 54px ${F.serif}`; x.fillText("Dibuat dengan", 34, 100); x.font = `italic 400 54px ${F.serif}`; x.fillText("tangan, untuk Anda.", 34, 160); x.font = `500 20px ${F.sans}`; x.fillText("CERITA KAMI · SEJAK 2019", 34, 214); });
  PL(gBr, 1.6, .8, story.t, -.5, .75, -1.46);
  const pend = G(gBr); B(pend, 5.95, .07, .07, m.ch, 0, 2.15, 1); B(pend, .07, 2.15, .07, m.ch, -2.9, 0, 1); B(pend, .07, 2.15, .07, m.ch, 2.9, 0, 1);
  [-1.6, .2, 1.9].forEach((x) => { C(pend, .01, .4, m.ch, x, 1.75, 1); C(pend, .22, .2, m.lamp, x, 1.55, 1, .06); }); fin(pend);
  LT.push(new T.PointLight(0xffd9a8, 0, 6, 2), new T.PointLight(0xffd9a8, 0, 6, 2)); LT[0].position.set(-1.2, 1.5, 1); LT[1].position.set(1.6, 1.5, 1); LT.forEach((l) => sc.add(l));
  const ped = G(gBr); C(ped, .38, .4, m.off, .7, FL, 1.45); B(ped, .4, .3, .3, m.card, .62, FL + .4, 1.45); B(ped, .4, .04, .31, m.acc, .62, FL + .58, 1.45); B(ped, .3, .22, .25, m.card, .82, FL + .7, 1.45); C(ped, .1, .2, M(0xe8dcc6), .9, FL + .4, 1.55); fin(ped);
  person(gBr, .2, 1.95, 4, 3); person(gBr, -.5, -.9, 0, .4); fin(gBr);
 
  // stage 3a — checkout
  const gCk = G(shop);
  const cb = B(gCk, 2.2, .55, .8, m.ch, 1.6, FL, .3), ct = B(gCk, 2.3, .05, .9, m.dw, 1.6, FL + .55, .3); cb.userData.o = ct.userData.o = [3, 0, 0];
  const up = [0, -.5, 0];
  const pos = G(gCk); C(pos, .04, .12, m.metal, .9, FL + .6, .32); const tab = B(pos, .52, .36, .03, m.ch, .9, FL + .72, .32); tab.rotation.x = -.25;
  PL(pos, .46, .3, scr("Rp 185.000", "Bayar sekarang"), .9, FL + .9, .346, 0, .7).rotation.x = -.25; pos.rotation.y = .2; pos.userData.o = up;
  const trm = G(gCk); B(trm, .16, .05, .22, m.ch, 1.4, FL + .6, .55); B(trm, .1, .02, .07, m.led, 1.4, FL + .65, .5); trm.userData.o = up;
  const prt = G(gCk); B(prt, .26, .14, .22, m.off, 2.0, FL + .6, .3); B(prt, .12, .12, .012, m.off, 2.0, FL + .74, .35); prt.userData.o = up;
  const qrT = CT(128, 128, (x) => { x.fillStyle = "#fff"; x.fillRect(0, 0, 128, 128); x.fillStyle = "#111"; for (let i = 0; i < 21; i++) for (let j = 0; j < 21; j++) if (!((i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12)) && Math.abs(Math.sin(i * 7.3 + j * 3.1) * 100 % 2) > 1) x.fillRect(10 + i * 5.3, 10 + j * 5.3, 5.3, 5.3); [[10, 10], [10, 87], [87, 10]].forEach((a) => { x.fillRect(a[0], a[1], 37, 37); x.fillStyle = "#fff"; x.fillRect(a[0] + 5, a[1] + 5, 27, 27); x.fillStyle = "#111"; x.fillRect(a[0] + 11, a[1] + 11, 15, 15); }); });
  const qr = G(gCk); B(qr, .28, .34, .03, m.off, 1.7, FL + .6, .62); PL(qr, .24, .24, qrT.t, 1.7, FL + .8, .636, 0, .4); qr.userData.o = up;
  person(gCk, 1.4, 1.15, 5, Math.PI); person(gCk, 1.0, -.45, 2, Math.PI); fin(gCk);
 
  // stage 3b — computer + customer data
  const gCp = G(shop); let dg = 0;
  const dash = CT(512, 300, (x, w, h) => {
    x.fillStyle = "#202022"; x.fillRect(0, 0, w, h); x.fillStyle = "#f1ece3"; x.textAlign = "left"; x.textBaseline = "alphabetic"; x.font = `600 18px ${F.sans}`; x.fillText("Rina Goods · Dashboard", 16, 28);
    [["Order", "128"], ["Pelanggan", "342"], ["Stok", "94%"]].forEach((a, i) => { x.fillStyle = "#2e2e31"; x.fillRect(16 + i * 166, 42, 154, 58); x.fillStyle = "#9d998f"; x.font = `13px ${F.sans}`; x.fillText(a[0], 26 + i * 166, 62); x.fillStyle = "#f1ece3"; x.font = `600 24px ${F.sans}`; x.fillText(a[1], 26 + i * 166, 90); });
    for (let i = 0; i < 12; i++) { const bh = (14 + (Math.sin(i * 1.3) + 1.3) * 20 + i * 4) * dg; x.fillStyle = i > 8 ? "#d9622b" : "#5c5c60"; x.fillRect(16 + i * 21, 270 - bh, 15, bh); }
    x.fillStyle = "#9d998f"; x.font = `13px ${F.sans}`; x.fillText("Order terbaru", 282, 128); x.font = `15px ${F.sans}`;
    ["#1042 Dewi    ✓ lunas", "#1041 Agus    ✓ diambil", "#1040 Sari    ● diproses", "#1039 Budi    ✓ kurir"].forEach((s, i) => { x.fillStyle = i == 2 ? "#d9622b" : "#f1ece3"; x.globalAlpha = dg > .1 ? 1 : 0; x.fillText(s, 282, 158 + i * 28); x.globalAlpha = 1; });
  });
  B(gCp, 1.7, .05, .6, m.dw, 1.9, FL + .5, -1.15); [[1.1, -1.4], [2.7, -1.4], [1.1, -.9], [2.7, -.9]].forEach((a) => B(gCp, .05, .5, .05, m.ch, a[0], FL, a[1]));
  C(gCp, .05, .1, m.metal, 1.9, FL + .55, -1.3); B(gCp, .95, .6, .05, m.ch, 1.9, FL + .62, -1.3);
  const scM = new T.MeshStandardMaterial({ map: dash.t, emissive: 0xffffff, emissiveMap: dash.t, emissiveIntensity: 0, roughness: .3 });
  const sp = new T.Mesh(new T.PlaneGeometry(.86, .5), scM); sp.position.set(1.9, FL + .93, -1.272); gCp.add(sp);
  B(gCp, .45, .02, .14, m.off, 1.9, FL + .55, -.95); B(gCp, .06, .03, .1, m.off, 2.3, FL + .55, -.95);
  B(gCp, .45, .95, .5, m.ch, 2.85, FL, -1.2); for (let i = 0; i < 4; i++) B(gCp, .32, .025, .01, m.led, 2.85, FL + .2 + i * .17, -.945);
  PL(gCp, .4, .1, TXT("DATA PELANGGAN", "#2c2c2f", "#bdb8ab", `600 46px ${F.sans}`, 512, 128), 2.85, FL + 1.02, -.94);
  person(gCp, .55, -.85, 1, -1.1); fin(gCp);
 
  // stage 4 — take-away annex
  const gTS = G(shop); gTS.position.x = 3; B(gTS, 3.4, .08, 4, m.conc, 1.7, 0, .5); B(gTS, 3.4, 1.7, .15, m.off, 1.7, 0, -1.55); B(gTS, .15, 1.7, 4, m.off, 3.35, 0, .5);
  const gTa = G(shop);
  B(gTa, 3.5, .5, .25, m.off, 4.75, 2.3, 2.5); B(gTa, .2, 2.3, .2, m.gray, 6.4, 0, 2.5); B(gTa, 3.5, .9, .4, m.ch, 4.75, 2.8, 2.45); B(gTa, 3.5, .06, .42, m.acc, 4.75, 2.74, 2.45);
  PL(gTa, 2.6, .6, TXT("TAKE AWAY", "#2c2c2f", "#f1ece3", `600 74px ${F.sans}`, 512, 120), 4.75, 3.25, 2.66, 0, .7);
  const caw = new T.Mesh(new T.BoxGeometry(3.4, .06, 1.1), m.acc); caw.position.set(4.7, 2.2, 3.05); caw.rotation.x = .25; caw.castShadow = true; gTa.add(caw);
  B(gTa, 2.6, .6, .5, m.ch, 4.7, FL, 2.1); B(gTa, 2.8, .05, .62, m.dw, 4.7, FL + .6, 2.1);
  [3.8, 4.1, 4.4].forEach((x, i) => { B(gTa, .2, .3, .14, m.card, x, FL + .65, 2.1 + (i % 2) * .08); B(gTa, .21, .05, .15, m.acc, x, FL + .85, 2.1 + (i % 2) * .08); });
  B(gTa, .4, .28, .03, m.ch, 5.2, FL + .7, 2.15); PL(gTa, .36, .22, scr("#1042", "Siap diambil"), 5.2, FL + .84, 2.17, 0, .7);
  B(gTa, .28, .34, .03, m.off, 5.7, FL + .65, 2.2); PL(gTa, .24, .24, qrT.t, 5.7, FL + .85, 2.22, 0, .4);
  [.7, 1.15].forEach((y, k) => { B(gTa, 2.9, .04, .35, m.dw, 4.6, y, -1.3); for (let j = 0; j < 7; j++) prod(gTa, 3.4 + j * .4, y + .04, -1.3, j + k); });
  person(gTa, 4.5, 1.6, 4, 0); person(gTa, 4.3, 3.4, 0, Math.PI); person(gTa, 5.4, 3.9, 2, Math.PI); person(gTa, 3.7, 4.1, 3, Math.PI);
  const sco = G(gTa); sco.position.set(7.1, 0, 3.7); sco.rotation.y = Math.PI;
  B(sco, .9, .18, .28, m.ch, 0, .2, 0); B(sco, .35, .1, .3, m.dw, -.1, .4, 0); B(sco, .08, .55, .08, m.ch, .38, .15, 0); B(sco, .08, .08, .4, m.ch, .38, .68, 0);
  [.4, -.38].forEach((x) => { C(sco, .16, .1, m.ch, x, 0, 0).rotation.x = Math.PI / 2; });
  B(sco, .5, .45, .45, m.off, -.55, .4, 0); B(sco, .52, .08, .46, m.acc, -.55, .62, 0);
  const rd = person(sco, -.05, 0, 5); rd.position.y = .32; sco.userData.o = [8, 0, 0];
  fin(gTa);
 
  /* ---- branches ---- */
  const BR = [[-12, -1], [11.5, -1], [-6, -12.5], [6.5, -12.5]];
  const BW = BR.map((a) => { const w = G(root); w.position.set(a[0], 0, a[1]); w.add(shop.clone()); w.visible = false; return w; });
 
  /* ---- life ---- */
  const gLife = G(root);
  const walkers = [[-7, 4.1, 1, .55], [-2, 4.5, 3, -.45], [3, 4.2, 0, .5], [9, 4.7, 5, -.6]].map((a) => ({ g: person(gLife, a[0], a[1], a[2]), v: a[3], i: a[2] }));
  const idle = [person(gLife, -1.2, 2.0, 2), person(gLife, 1.6, 3.6, 4)];
 
  /* ---- data lines ---- */
  const gD = G(root), LN: Line[] = [];
  const lines: Array<[V3[], number, number, number]> = [
    [[[.9, 1.05, .4], [1.4, 1.4, -.4], [2.0, 1.35, -1.0]], .52, .58, .02],
    [[[2.4, .9, -1.2], [2.7, .8, -1.2], [2.85, 1.1, -1.2]], .58, .62, .02],
    [[[2.85, .8, -1.4], [3.4, .2, -.5], [4.5, .2, 1], [4.6, .9, 2.1]], .7, .77, .02],
  ];
  BR.forEach((b, i) => lines.push([[[2.85, 1.1, -1.2], [(2.85 + b[0]) / 2, 5.5, (b[1] - 1.2) / 2], [b[0] + 1.4, 2.9, b[1] + 1]], .84 + i * .025, .92 + i * .02, .045]));
  lines.forEach((a) => {
    const cu = new T.CatmullRomCurve3(a[0].map((v) => new T.Vector3(...v)), false, "catmullrom", .2), r = a[3];
    const g1 = new T.TubeGeometry(cu, 80, r, 6, false), g2 = new T.TubeGeometry(cu, 80, r * 3.2, 8, false);
    const l1 = new T.Mesh(g1, new T.MeshBasicMaterial({ color: 0xe8743a })), l2 = new T.Mesh(g2, new T.MeshBasicMaterial({ color: AC, transparent: true, opacity: .14, depthWrite: false }));
    const pu = new T.Mesh(new T.SphereGeometry(r * 3, 10, 8), new T.MeshBasicMaterial({ color: 0xffe0c8 }));
    gD.add(l1, l2, pu); LN.push({ cu, g1, g2, pu, a: a[1], b: a[2], n: (g1.index as T.BufferAttribute).count });
  });
 
  /* ---- animation ---- */
  const ss = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a))), eo = (t: number) => 1 - Math.pow(1 - t, 3), eb = (t: number) => 1 + 2.5 * Math.pow(t - 1, 3) + 1.5 * Math.pow(t - 1, 2);
  function stag(g: T.Object3D, t: number, off: V3) {
    g.visible = t > 0; const n = g.children.length;
    g.children.forEach((c, i) => {
      const ti = Math.min(1, Math.max(0, t * 1.6 - i / n * .6)), e = eb(ti), b = c.userData.b as T.Vector3, d = (c.userData.o as V3 | undefined) || off;
      c.visible = ti > 0; c.position.set(b.x + d[0] * (1 - e), b.y + d[1] * (1 - e), b.z + d[2] * (1 - e)); c.scale.setScalar(Math.max(e, .001));
    });
  }
  const K: Array<[number, V3, V3, number]> = [[0, [5.5, 9, 15], [0, .9, 1], 1.15], [.2, [5, 9.5, 14], [0, 1, 1], 1.1], [.4, [5.5, 10, 14], [.6, .9, .4], 1.12], [.6, [7, 10, 14], [2.2, .8, .8], 1.32], [.78, [7.4, 10, 14], [2.4, .8, .8], 1.4], [.92, [7, 12, 16], [0, 0, -5], 2.5], [1, [8, 13, 17], [0, 0, -5.5], 2.6]];
  function camAt(p: number): [V3, V3, number] {
    let i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1]; let t = ss(p, a[0], b[0]); t = t * t * (3 - 2 * t);
    const l = (u: V3, v: V3) => u.map((x, j) => x + (v[j] - x) * t) as V3; return [l(a[1], b[1]), l(a[2], b[2]), a[3] + (b[3] - a[3]) * t];
  }
  function size() {
    const W = o.container.clientWidth || 1, H = o.container.clientHeight || 1;
    R.setSize(W, H, false); cam.aspect = W / H;
    cam.setViewOffset(W, H, W * (W > 520 ? .1 : .06), 0, W, H); cam.updateProjectionMatrix(); // shifts scene left, leaving room for the legend
  }
  const ro = new ResizeObserver(size); ro.observe(o.container); size();
  let mx = 0, my = 0, tx = 0, ty = 0;
  const onMove = (e: PointerEvent) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; };
  addEventListener("pointermove", onMove);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let idx = -1, lgK = -1, P = 0, last = performance.now(), time = 0, dgT = 0, raf = 0, dead = false;
 
  function frame(now: number) {
    if (dead) return; raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); // rAF timestamp can precede performance.now() on the first frame → clamp to >= 0 last = now; time += dt;
    const tg = o.getProgress(); P = reduce ? tg : P + (tg - P) * Math.min(1, dt * 5); const p = P;
    let ni = 0; STAGE_THRESHOLDS.forEach((t, i) => { if (p >= t - .001) ni = i; }); if (ni !== idx) { idx = ni; o.onStage(ni); }
    // let k = 0; LEGEND_THRESHOLDS.forEach((t, i) => { if (p >= t - .001) k = i; }); if (k !== lgK) { lgK = k; o.onLegend(k); }
 
    stag(gSt, ss(p, .2, .3), [0, 2.2, 0]); stag(gBr, ss(p, .3, .4), [0, 1.6, 0]); stag(gCk, ss(p, .4, .5), [0, -.4, 0]); stag(gCp, ss(p, .5, .6), [0, -.5, 0]);
    const ta = ss(p, .6, .69); gTS.visible = ta > 0; gTS.scale.x = Math.max(eo(ta), .001); stag(gTa, ss(p, .65, .78), [0, 1.2, 0]);
    BW.forEach((w, i) => { const t = ss(p, .78 + i * .025, .86 + i * .025); w.visible = t > 0; const e = Math.max(eb(t), .001) * .8; w.scale.set(e, e, e); w.position.y = -(1 - eo(t)) * 1.5; });
    const bt = ss(p, .3, .4); LT.forEach((l) => (l.intensity = bt * 1.3 * PLS));
    const on = ss(p, .52, .6); scM.emissiveIntensity = on * .9; dg = eo(ss(p, .52, .8)); dgT += dt; if (on > 0 && dgT > .12) { dgT = 0; dash.r(); }
    LN.forEach((l, i) => { const t = ss(p, l.a, l.b), c = Math.floor(t * l.n / 3) * 3; l.g1.setDrawRange(0, c); l.g2.setDrawRange(0, c); l.pu.visible = t >= 1; if (t >= 1) l.pu.position.copy(l.cu.getPoint(((time * (p > .92 ? .3 : .2) + i * .27) % 1 + 1) % 1)); });
    walkers.forEach((w) => { const g = w.g; g.position.x += w.v * dt; if (g.position.x > 14) g.position.x = -14; if (g.position.x < -14) g.position.x = 14; g.position.y = Math.abs(Math.sin(time * 6 + w.i)) * .03; g.rotation.y = w.v > 0 ? 1.57 : -1.57; });
    idle.forEach((g, i) => { g.rotation.y = Math.sin(time * .6 + i) * .4 + Math.PI; g.position.y = Math.sin(time * 1.4 + i) * .01; });
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    const c = camAt(p), zm = c[2] * Math.max(1, 1 / cam.aspect), lk = new T.Vector3(...c[1]);
    cam.position.set(lk.x + (c[0][0] - lk.x) * zm + mx * 2.2 + Math.sin(time * .2) * .25, lk.y + (c[0][1] - lk.y) * zm - my * 1.4, lk.z + (c[0][2] - lk.z) * zm); cam.lookAt(lk);
    R.render(sc, cam);
  }
  Promise.all([`600 20px ${F.sans}`, `400 40px ${F.serif}`, `italic 400 40px ${F.serif}`, `600 40px ${F.hand}`].map((f) => document.fonts.load(f)))
    .then(() => { if (!dead) TX.forEach((r) => r()); }).catch(() => {});
  raf = requestAnimationFrame(frame);
 
  /* ---- cleanup ---- */
  return () => {
    dead = true; cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("pointermove", onMove);
    sc.traverse((n) => {
      const mesh = n as T.Mesh;
      mesh.geometry?.dispose();
      const mt = mesh.material;
      if (mt) (Array.isArray(mt) ? mt : [mt]).forEach((q) => { (q as T.MeshStandardMaterial).map?.dispose(); q.dispose(); });
    });
    R.dispose();
  };
}
 
