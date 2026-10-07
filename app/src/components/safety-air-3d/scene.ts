import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { badge, compressorFront, compressorSide, concrete, contactShadow, corrugated, grass, louvre, pavers, rng, sky } from "./textures";

/*
 * Safety Air, procedural 3D model (three.js).
 *
 * Built from the real installations in the site photos: modular cabin in
 * grey trapezoidal steel, louvred ventilation panels, double door with a
 * window, exhaust hoods on the roof, compressor and dryer inside, blue air
 * receiver and piping outside. Scenery: paved yard, a corrugated factory
 * wall and a ring of trees, softened by fog so it never competes with the
 * cabin.
 *
 * Rendering is on demand: frames are drawn only while something moves
 * (orbit damping, auto-rotate, roof/door/camera tweens), and the loop stops
 * when the viewer leaves the screen.
 */

export type SafetyAirScene = {
  setRoof: (removed: boolean) => void;
  setDoors: (open: boolean) => void;
  setInside: (inside: boolean) => void;
  reset: () => void;
  dispose: () => void;
};

const W = 4.2, D = 2.8, H = 2.5, T = 0.07, BASE = 0.16;
const DOOR_W = 1.8, DOOR_H = 2.15;
const HORIZON = "#dfe6e6";

type Tween = { from: number; to: number; t: number; dur: number; apply: (v: number) => void; done?: () => void };
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function createSafetyAirScene(host: HTMLElement, opts: { reducedMotion: boolean; onFirstFrame?: () => void }): SafetyAirScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = sky(HORIZON);
  scene.fog = new THREE.Fog(HORIZON, 18, 55);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 200);
  const HOME = { pos: new THREE.Vector3(8.2, 4.6, 9.4), target: new THREE.Vector3(0.3, 1.1, 0) };
  const TOP = { pos: new THREE.Vector3(4.6, 8.2, 6.2), target: new THREE.Vector3(0, 0.6, -0.2) };
  const INSIDE = { pos: new THREE.Vector3(1.75, 1.75, 1.2), target: new THREE.Vector3(-0.35, 0.85, -0.55) };
  camera.position.copy(HOME.pos);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(HOME.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 17;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.autoRotate = !opts.reducedMotion;
  controls.autoRotateSpeed = 0.55;
  controls.update();

  // ---- lights
  scene.add(new THREE.HemisphereLight("#e4edf5", "#77715f", 1.0));
  const sun = new THREE.DirectionalLight("#fff4e2", 2.4);
  sun.position.set(-5.5, 10, 6.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -7; sun.shadow.camera.right = 7; sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -7;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
  scene.add(sun);

  const disposables: Array<{ dispose: () => void }> = [envTex, pmrem];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);
  const std = (p: THREE.MeshStandardMaterialParameters) => track(new THREE.MeshStandardMaterial(p));
  const box = (w: number, h: number, d: number) => track(new THREE.BoxGeometry(w, h, d));
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material | THREE.Material[], shadow = true) => {
    const o = new THREE.Mesh(g, m); o.castShadow = shadow; o.receiveShadow = true; return o;
  };

  // ---- materials
  const steelBack = corrugated("#8b9298", W / 0.2);
  const steelSide = corrugated("#8b9298", D / 0.2);
  const steelPart = corrugated("#8b9298", ((W - DOOR_W) / 2) / 0.2);
  const steelLeaf = corrugated("#8f969c", (DOOR_W / 2) / 0.2);
  [steelBack, steelSide, steelPart, steelLeaf].forEach((s) => { track(s.map); track(s.normalMap); });
  const steel = (s: { map: THREE.Texture; normalMap: THREE.Texture }) => std({ map: s.map, normalMap: s.normalMap, normalScale: new THREE.Vector2(1.4, 1.4), metalness: 0.55, roughness: 0.42 });
  const frameMat = std({ color: "#454b51", metalness: 0.6, roughness: 0.38 });
  const lv = louvre(16); track(lv.map); track(lv.normalMap);
  const louvreMat = std({ map: lv.map, normalMap: lv.normalMap, metalness: 0.5, roughness: 0.5 });
  const roofMat = std({ color: "#c9cdd0", metalness: 0.5, roughness: 0.4 });
  const hoodMat = std({ color: "#b9bec2", metalness: 0.7, roughness: 0.3 });
  const glassMat = std({ color: "#1d2a33", metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.55 });
  const blueMat = std({ color: "#1f6fb2", metalness: 0.35, roughness: 0.3 });
  const floorIn = std({ map: track(concrete(2, "#a9adb0")), roughness: 0.7, metalness: 0.05 });

  // ---- ground: grass + paved yard
  const g = track(grass(40));
  const ground = mesh(track(new THREE.CircleGeometry(80, 48)), std({ map: g, roughness: 1 }), false);
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const pv = pavers(5); track(pv.map); track(pv.roughnessMap);
  const yard = mesh(track(new THREE.PlaneGeometry(18, 14)), std({ map: pv.map, roughnessMap: pv.roughnessMap, roughness: 1 }), false);
  yard.rotation.x = -Math.PI / 2; yard.position.set(0, 0.005, 1); scene.add(yard);

  // ---- factory wall behind (blue corrugated, like the plant in the photos)
  const facSteel = corrugated("#4a6589", 34 / 0.35, 1); track(facSteel.map); track(facSteel.normalMap);
  const factory = new THREE.Group();
  const facWall = mesh(box(34, 9, 0.3), [std({ color: "#4a6589", roughness: 0.6 }), std({ color: "#4a6589" }), std({ color: "#3a3f45" }), std({ color: "#4a6589" }), std({ map: facSteel.map, normalMap: facSteel.normalMap, metalness: 0.45, roughness: 0.5 }), std({ color: "#4a6589" })], false);
  facWall.position.set(0, 4.5, -15.5); factory.add(facWall);
  const facBlock = mesh(box(34, 9, 18), std({ color: "#4a6589", roughness: 0.7 }), false);
  facBlock.position.set(0, 4.5, -24.7); factory.add(facBlock);
  const facRoof = mesh(box(34.6, 0.5, 19), std({ color: "#5a6168", roughness: 0.6 }), false);
  facRoof.position.set(0, 9.2, -24.5); factory.add(facRoof);
  const windowMat = std({ color: "#b8d4e6", metalness: 0.4, roughness: 0.1, emissive: "#9fc3dc", emissiveIntensity: 0.15 });
  for (let i = 0; i < 6; i++) { const win = mesh(box(3.6, 0.9, 0.05), windowMat, false); win.position.set(-13 + i * 5.2, 7.2, -15.33); factory.add(win); }
  const roll = mesh(box(4.2, 4.6, 0.05), std({ color: "#c9cdd0", metalness: 0.5, roughness: 0.45 }), false);
  roll.position.set(9.5, 2.3, -15.33); factory.add(roll);
  scene.add(factory);

  // ---- trees (instanced): pines and broadleaf, in a ring behind and to the sides
  const r = rng(42);
  const trunkGeo = track(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 6));
  const pineGeo = track(new THREE.ConeGeometry(1.2, 3.6, 10));
  const leafGeo = track(new THREE.IcosahedronGeometry(1.5, 2));
  const trunkMat = std({ color: "#5b4636", roughness: 1 });
  const foliage = std({ color: "#ffffff", roughness: 0.9, flatShading: true });
  const N = 70;
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, N);
  const pines = new THREE.InstancedMesh(pineGeo, foliage, N);
  const leaves = new THREE.InstancedMesh(leafGeo, foliage, N);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
  const hide = new THREE.Matrix4().makeScale(0, 0, 0);
  let placed = 0;
  while (placed < N) {
    const ang = r() * Math.PI * 2, rad = 22 + r() * 24;
    const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad;
    if (z > -16 && z < 12 && x > -14 && x < 14) continue;           // keep the yard and camera side clear
    if (z > 6 && Math.abs(x) < 18) continue;                         // nothing straight in front of the default view
    const s = 1.1 + r() * 0.9, pine = r() < 0.55;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * Math.PI);
    trunks.setMatrixAt(placed, m4.compose(p.set(x, 0.8 * s, z), q, sc.set(s, s, s)));
    if (pine) {
      pines.setMatrixAt(placed, m4.compose(p.set(x, (1.6 + 1.8) * s, z), q, sc.set(s, s, s)));
      leaves.setMatrixAt(placed, hide);
    } else {
      leaves.setMatrixAt(placed, m4.compose(p.set(x, (1.6 + 1.2) * s, z), q, sc.set(s * 1.1, s, s * 1.1)));
      pines.setMatrixAt(placed, hide);
    }
    col.setHSL(0.26 + r() * 0.06, 0.22 + r() * 0.1, 0.3 + r() * 0.08);
    pines.setColorAt(placed, col); leaves.setColorAt(placed, col);
    placed++;
  }
  scene.add(trunks, pines, leaves);

  // ---- cabin
  const cabin = new THREE.Group();
  scene.add(cabin);
  const slab = mesh(box(W + 0.5, BASE, D + 0.5), std({ map: track(concrete(3)), roughness: 0.9 }));
  slab.position.y = BASE / 2; cabin.add(slab);
  const contact = new THREE.Mesh(track(new THREE.PlaneGeometry(W + 2.4, D + 2.4)), track(new THREE.MeshBasicMaterial({ map: track(contactShadow()), transparent: true, depthWrite: false })));
  contact.rotation.x = -Math.PI / 2; contact.position.y = 0.012; cabin.add(contact);
  const floor = mesh(track(new THREE.PlaneGeometry(W - 2 * T, D - 2 * T)), floorIn, false);
  floor.rotation.x = -Math.PI / 2; floor.position.y = BASE + 0.003; cabin.add(floor);

  const y0 = BASE + H / 2;
  const back = mesh(box(W, H, T), steel(steelBack)); back.position.set(0, y0, -D / 2 + T / 2); cabin.add(back);
  for (const sx of [-1, 1]) {
    const side = mesh(box(T, H, D), steel(steelSide)); side.position.set(sx * (W / 2 - T / 2), y0, 0); cabin.add(side);
    for (const dz of [-0.62, 0.62]) {
      const lv1 = mesh(box(0.02, 1.5, 0.78), louvreMat); lv1.position.set(sx * (W / 2 + 0.03), BASE + 1.28, dz); cabin.add(lv1);
      const lvFrame = mesh(box(0.03, 1.6, 0.88), frameMat); lvFrame.position.set(sx * (W / 2 + 0.012), BASE + 1.28, dz); cabin.add(lvFrame);
    }
  }
  const partW = (W - DOOR_W) / 2;
  for (const sx of [-1, 1]) {
    const part = mesh(box(partW, H, T), steel(steelPart)); part.position.set(sx * (DOOR_W / 2 + partW / 2), y0, D / 2 - T / 2); cabin.add(part);
  }
  const header = mesh(box(DOOR_W, H - DOOR_H, T), steel(steelPart)); header.position.set(0, BASE + DOOR_H + (H - DOOR_H) / 2, D / 2 - T / 2); cabin.add(header);

  // frame: posts and rails
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const post = mesh(box(0.12, H, 0.12), frameMat); post.position.set(sx * (W / 2 - 0.02), y0, sz * (D / 2 - 0.02)); cabin.add(post); }
  for (const yy of [BASE + 0.05, BASE + H - 0.05]) {
    for (const sz of [-1, 1]) { const rail = mesh(box(W + 0.04, 0.1, 0.1), frameMat); rail.position.set(0, yy, sz * (D / 2 - 0.02)); cabin.add(rail); }
    for (const sx of [-1, 1]) { const rail = mesh(box(0.1, 0.1, D + 0.04), frameMat); rail.position.set(sx * (W / 2 - 0.02), yy, 0); cabin.add(rail); }
  }

  // doors: two leaves hinged at the outer edges; the left one has a window
  const leafMat = steel(steelLeaf);
  const doors: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(sx * DOOR_W / 2, BASE, D / 2 - T / 2 + 0.01);
    const leaf = mesh(box(DOOR_W / 2 - 0.02, DOOR_H - 0.02, 0.05), leafMat);
    leaf.position.set(-sx * (DOOR_W / 4), DOOR_H / 2, 0); pivot.add(leaf);
    const handle = mesh(box(0.03, 0.22, 0.05), frameMat); handle.position.set(-sx * (DOOR_W / 2 - 0.1), 1.05, 0.05); pivot.add(handle);
    if (sx < 0) {
      const wf = mesh(box(0.56, 0.4, 0.06), std({ color: "#f2f3f3", roughness: 0.4 })); wf.position.set(DOOR_W / 4, 1.55, 0.005); pivot.add(wf);
      const gl = mesh(box(0.48, 0.32, 0.07), glassMat, false); gl.position.set(DOOR_W / 4, 1.55, 0.006); pivot.add(gl);
    }
    cabin.add(pivot); doors.push(pivot);
  }
  const bTex = track(badge());
  const badgeMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(0.42, 0.56)), std({ map: bTex, transparent: true, roughness: 0.5 }));
  badgeMesh.position.set(DOOR_W / 2 + partW / 2, BASE + 1.62, D / 2 + 0.006); cabin.add(badgeMesh);

  // inside: compressor + dryer
  const cf = track(compressorFront()), cs = track(compressorSide());
  const cSide = std({ map: cs, roughness: 0.55, metalness: 0.1 });
  const cTop = std({ color: "#1d2023", roughness: 0.6 });
  const comp = mesh(box(1.15, 1.6, 1.0), [cSide, cSide, cTop, cTop, std({ map: cf, roughness: 0.5, metalness: 0.1 }), cSide]);
  comp.position.set(-0.75, BASE + 0.8, -0.45); cabin.add(comp);
  const dryer = mesh(box(0.62, 1.15, 0.72), std({ color: "#d9dcde", roughness: 0.45, metalness: 0.2 }));
  dryer.position.set(0.95, BASE + 0.575, -0.72); cabin.add(dryer);
  const dPanel = mesh(box(0.3, 0.16, 0.01), std({ color: "#233a4f", roughness: 0.2 })); dPanel.position.set(0.95, BASE + 0.95, -0.355); cabin.add(dPanel);
  // internal piping compressor -> dryer -> wall
  const pipe = (a: THREE.Vector3, b: THREE.Vector3, rad = 0.035) => {
    const len = a.distanceTo(b); const c = mesh(track(new THREE.CylinderGeometry(rad, rad, len, 12)), blueMat);
    c.position.copy(a).add(b).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); return c;
  };
  cabin.add(pipe(new THREE.Vector3(-0.3, BASE + 1.45, -0.6), new THREE.Vector3(-0.3, BASE + 1.85, -0.6)));
  cabin.add(pipe(new THREE.Vector3(-0.3, BASE + 1.85, -0.6), new THREE.Vector3(0.95, BASE + 1.85, -0.6)));
  cabin.add(pipe(new THREE.Vector3(0.95, BASE + 1.85, -0.6), new THREE.Vector3(0.95, BASE + 1.15, -0.6)));
  cabin.add(pipe(new THREE.Vector3(0.95, BASE + 1.85, -0.6), new THREE.Vector3(W / 2 + 0.6, BASE + 1.85, -0.6)));

  // outside: blue air receiver + piping
  const tank = new THREE.Group(); tank.position.set(W / 2 + 1.05, BASE, -0.4);
  const shell = mesh(track(new THREE.CylinderGeometry(0.4, 0.4, 1.6, 32)), blueMat); shell.position.y = 1.15; tank.add(shell);
  for (const yy of [0.35, 1.95]) { const cap = mesh(track(new THREE.SphereGeometry(0.4, 32, 12, 0, Math.PI * 2, yy > 1 ? 0 : Math.PI / 2, Math.PI / 2)), blueMat); cap.position.y = yy; tank.add(cap); }
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const leg = mesh(box(0.05, 0.4, 0.05), frameMat); leg.position.set(Math.cos(a) * 0.3, 0.2, Math.sin(a) * 0.3); tank.add(leg); }
  cabin.add(tank);
  cabin.add(pipe(new THREE.Vector3(W / 2 + 0.6, BASE + 1.85, -0.6), new THREE.Vector3(W / 2 + 0.6, BASE + 2.55, -0.6)));
  cabin.add(pipe(new THREE.Vector3(W / 2 + 0.6, BASE + 2.55, -0.6), new THREE.Vector3(W / 2 + 1.05, BASE + 2.55, -0.4)));
  cabin.add(pipe(new THREE.Vector3(W / 2 + 1.05, BASE + 2.55, -0.4), new THREE.Vector3(W / 2 + 1.05, BASE + 2.3, -0.4)));

  // roof group (removable): roof sheet, exhaust hoods, LED strip
  const roof = new THREE.Group();
  const roofSheet = mesh(box(W + 0.24, 0.08, D + 0.24), roofMat); roofSheet.position.y = BASE + H + 0.04; roof.add(roofSheet);
  for (const hx of [-0.9, 0.55]) {
    const base = mesh(box(0.7, 0.35, 0.7), hoodMat); base.position.set(hx, BASE + H + 0.25, -0.45); roof.add(base);
    const neck = mesh(box(0.62, 0.55, 0.62), hoodMat); neck.position.set(hx, BASE + H + 0.65, -0.45); roof.add(neck);
    const mouth = mesh(box(0.72, 0.5, 0.75), hoodMat); mouth.position.set(hx, BASE + H + 0.95, -0.25); mouth.rotation.x = -0.5; roof.add(mouth);
  }
  const led = new THREE.Mesh(track(new THREE.PlaneGeometry(2.6, 0.08)), track(new THREE.MeshBasicMaterial({ color: "#f4f8ff" })));
  led.rotation.x = Math.PI / 2; led.position.set(0, BASE + H - 0.01, 0.2); roof.add(led);
  cabin.add(roof);
  const roofMats = [roofMat, hoodMat];
  const inLight = new THREE.PointLight("#f4f8ff", 0, 6, 1.6); inLight.position.set(0, BASE + H - 0.3, 0.2); cabin.add(inLight);

  // ---- loop
  const tweens: Tween[] = [];
  let raf = 0, visible = true, last = performance.now(), first = true;
  const animate = (from: number, to: number, dur: number, apply: (v: number) => void, done?: () => void) => {
    if (opts.reducedMotion || dur === 0) { apply(to); done?.(); kick(); return; }
    tweens.push({ from, to, t: 0, dur, apply, done }); kick();
  };
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i]; tw.t = Math.min(1, tw.t + dt / tw.dur); tw.apply(tw.from + (tw.to - tw.from) * ease(tw.t));
      if (tw.t >= 1) { tweens.splice(i, 1); tw.done?.(); }
    }
    const moving = controls.update(dt);
    renderer.render(scene, camera);
    if (first) { first = false; opts.onFirstFrame?.(); }
    if (visible && (moving || tweens.length || controls.autoRotate)) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  controls.addEventListener("change", kick);
  controls.addEventListener("start", () => { controls.autoRotate = false; });

  let fovExtra = 0;
  const baseFov = () => (camera.aspect < 1 ? 50 : 36);
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = baseFov() + fovExtra; camera.updateProjectionMatrix(); kick();
  };
  const ro = new ResizeObserver(resize); ro.observe(host); resize();
  const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) kick(); }, { threshold: 0.01 }); io.observe(host);

  // ---- state
  let roofOff = false, doorsOpen = false, inside = false;
  const roofLift = (v: number) => {
    roof.position.y = v * 2.4;
    roofMats.forEach((m) => { m.transparent = v > 0; m.opacity = 1 - v; m.depthWrite = v < 0.5; });
    roof.visible = v < 0.99;
    inLight.intensity = (1 - v) * (inside || doorsOpen ? 2.2 : 0.8);
  };
  const doorAngle = (v: number) => { doors[0].rotation.y = -v * 1.75; doors[1].rotation.y = v * 1.75; };
  const fly = (to: { pos: THREE.Vector3; target: THREE.Vector3 }, dur = 1.4, fov = 0) => {
    const p0 = camera.position.clone(), t0 = controls.target.clone(), f0 = fovExtra;
    controls.autoRotate = false;
    animate(0, 1, dur, (v) => {
      camera.position.lerpVectors(p0, to.pos, v); controls.target.lerpVectors(t0, to.target, v);
      fovExtra = f0 + (fov - f0) * v; camera.fov = baseFov() + fovExtra; camera.updateProjectionMatrix();
    });
  };
  roofLift(0); doorAngle(0);
  kick();

  const api: SafetyAirScene = {
    setRoof(removed) { if (removed === roofOff) return; roofOff = removed; animate(removed ? 0 : 1, removed ? 1 : 0, 1.1, roofLift); if (!inside) fly(removed ? TOP : HOME, 1.4); },
    setDoors(open) { if (open === doorsOpen) return; doorsOpen = open; animate(open ? 0 : 1, open ? 1 : 0, 1.0, doorAngle); inLight.intensity = roofOff ? 0 : open ? 2.2 : 0.8; },
    setInside(next) {
      if (next === inside) return; inside = next;
      if (next) {
        if (!doorsOpen) api.setDoors(true);
        controls.minDistance = 0.4; controls.maxDistance = 3.2; controls.maxPolarAngle = Math.PI * 0.62;
        fly(INSIDE, 1.8, 18);
      } else {
        controls.minDistance = 3.2; controls.maxDistance = 17; controls.maxPolarAngle = Math.PI * 0.47;
        fly(HOME, 1.5);
      }
    },
    reset() { api.setInside(false); api.setRoof(false); api.setDoors(false); fly(HOME, 1.2); },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); controls.dispose();
      scene.traverse((o) => { if (o instanceof THREE.InstancedMesh) o.dispose(); });
      disposables.forEach((d) => d.dispose());
      renderer.dispose(); renderer.domElement.remove();
    },
  };
  return api;
}
