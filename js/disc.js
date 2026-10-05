// The disc: a floating, spinning CD rendered into any canvas.
//
//   const disc = mountDisc(canvas, { photos: [] });
//   disc.pose.x = 0.5;   // screen-relative position, -1..1 across the canvas
//   disc.pose.scale = 0.6;
//
// The canvas is transparent unless `background` is given (opaque is more
// reliable for full-screen fixed canvases).
// Pose values are eased toward, so pages can set them on scroll freely.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function blob(alpha) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, `rgba(0,0,0,${alpha})`);
  r.addColorStop(0.55, `rgba(0,0,0,${alpha * 0.45})`);
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

const ring = (outer, inner) => {
  const s = new THREE.Shape().absarc(0, 0, outer, 0, Math.PI * 2);
  s.holes.push(new THREE.Path().absarc(0, 0, inner, 0, Math.PI * 2, true));
  return s;
};

// Diffraction streaks: a conic rainbow that we counter-rotate so the
// highlight stays put while the disc spins, like a real CD under a lamp.
function diffractionTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  const cg = g.createConicGradient(0.35, 512, 512);
  const half = [
    [0, "#e6e6e4"], [0.035, "#b9f0d7"], [0.07, "#fff6a8"], [0.1, "#ffffff"], [0.14, "#c6d3ff"],
    [0.18, "#c9c9c9"], [0.24, "#3a3a44"], [0.31, "#16161c"], [0.37, "#4a4a55"], [0.42, "#e9b3f2"], [0.46, "#a6e8ff"], [0.5, "#e6e6e4"],
  ];
  for (const [o, col] of half) { cg.addColorStop(o, col); cg.addColorStop(Math.min(o + 0.5, 1), col); }
  g.fillStyle = cg;
  g.fillRect(0, 0, 1024, 1024);
  // fine grooves
  g.globalAlpha = 0.05;
  for (let r = 160; r < 512; r += 1.6) {
    g.strokeStyle = Math.random() > 0.5 ? "#000" : "#fff";
    g.beginPath(); g.arc(512, 512, r, 0, Math.PI * 2); g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.center.set(0.5, 0.5);
  tex.anisotropy = 8;
  return tex;
}

// Map UVs straight from the disc's XY so the texture is centred.
function planarUV(geo, r) {
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / (2 * r) + 0.5, p.getY(i) / (2 * r) + 0.5);
  return geo;
}

// Optional film-frame gatefold above the disc.
function filmTexture(src, n) {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  g.fillStyle = "#0b0b0b";
  g.fillRect(0, 0, 1024, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const img = new Image();
  img.onload = () => {
    const x = 74, y = 52, w = 1024 - 148, h = 1024 - 104;
    const s = Math.max(w / img.width, h / img.height);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.drawImage(img, x + (w - img.width * s) / 2, y + (h - img.height * s) / 2, img.width * s, img.height * s);
    g.restore();
    g.fillStyle = "#f2a25c";
    g.font = "600 24px monospace";
    g.save(); g.translate(46, 900); g.rotate(-Math.PI / 2); g.fillText(`KODAK E100   ${n}`, 0, 0); g.restore();
    tex.needsUpdate = true;
  };
  img.src = src;
  return tex;
}
function filmPanel(src, n, side) {
  const geo = new THREE.PlaneGeometry(2, 2, 24, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, 0.1 * Math.pow((pos.getX(i) + 1) / 2 - (side < 0 ? 0 : 1), 2));
  geo.computeVertexNormals();
  geo.translate(side, 0, 0); // hinge at x = 0
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: filmTexture(src, n), roughness: 0.5, side: THREE.DoubleSide }));
}

export function mountDisc(canvas, { photos = [], tilt = 0.22, parallax = 1, background = null, exposure = 1.05 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: !background });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  if (background) renderer.setClearColor(background, 1);
  else renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const DIST = 11;

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.2), new THREE.MeshBasicMaterial({ map: blob(0.28), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  const discTex = diffractionTexture();
  const disc = new THREE.Group();
  disc.add(
    new THREE.Mesh(
      planarUV(new THREE.ExtrudeGeometry(ring(2, 0.62), { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 160 }), 2),
      new THREE.MeshPhysicalMaterial({ map: discTex, metalness: 0.8, roughness: 0.16, iridescence: 0.5, iridescenceIOR: 1.8, iridescenceThicknessRange: [200, 700], clearcoat: 1, clearcoatRoughness: 0.03 })
    ),
    new THREE.Mesh(
      new THREE.ExtrudeGeometry(ring(0.62, 0.2), { depth: 0.022, bevelEnabled: false, curveSegments: 96 }),
      new THREE.MeshPhysicalMaterial({ color: 0xf6f6f6, roughness: 0.25, transmission: 0.85, thickness: 0.05, ior: 1.45 })
    ),
    new THREE.Mesh(
      new THREE.ExtrudeGeometry(ring(0.75, 0.62), { depth: 0.027, bevelEnabled: false, curveSegments: 96 }),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d6, metalness: 0.6, roughness: 0.35 })
    )
  );
  const rig = new THREE.Group();
  rig.add(disc);
  scene.add(rig);

  const fold = new THREE.Group();
  if (photos.length >= 2) {
    const l = filmPanel(photos[0], 41, -1), r = filmPanel(photos[1], 49, 1);
    l.rotation.y = 0.2;
    r.rotation.y = -0.2;
    fold.add(l, r);
    fold.position.set(0, 2.1, -0.3);
    rig.add(fold);
  }

  // What pages drive. `cur` eases toward `pose` every frame.
  const pose = { x: 0, y: 0, scale: 1, tilt, shadow: 1, spin: 0, speed: 1 };
  const cur = { ...pose };

  let halfW = 1, halfH = 1;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = DIST * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    halfW = halfH * camera.aspect;
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  const pointer = { x: 0, y: 0 };
  addEventListener("pointermove", (e) => {
    pointer.x = e.clientX / innerWidth - 0.5;
    pointer.y = e.clientY / innerHeight - 0.5;
  });

  let spin = 0, lastY = scrollY, boost = 0;
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    const motion = reduce ? 0.15 : 1;
    boost = (boost + Math.abs(scrollY - lastY) * 0.0006) * 0.94;
    lastY = scrollY;
    for (const k in pose) cur[k] += (pose[k] - cur[k]) * 0.08;

    spin += (0.006 + boost) * motion * cur.speed;
    disc.rotation.z = spin + cur.spin;
    discTex.rotation = -disc.rotation.z + pointer.x * 0.6 * parallax;

    // Keep the disc inside narrow canvases.
    const fit = Math.min(1, halfW / 2.3) * cur.scale;
    const bob = Math.sin(t * 0.9) * 0.05 * motion;
    rig.scale.setScalar(fit);
    rig.position.set(cur.x * halfW, cur.y * halfH + bob * fit, 0);
    rig.rotation.x = -Math.PI / 2 + cur.tilt;
    rig.rotation.y = Math.sin(t * 0.4) * 0.04 * motion;
    fold.position.y = 2.1 + Math.sin(t * 0.7 + 1) * 0.04 * motion;

    shadow.position.set(rig.position.x + 0.15 * fit, rig.position.y - 1.1 * fit - bob * fit, 0.2);
    shadow.scale.setScalar(fit * (1 + bob * 0.8));
    shadow.material.opacity = cur.shadow * (1 - bob * 3);

    camera.position.set(pointer.x * 1.2 * parallax, 0.9 - pointer.y * 0.5 * parallax, DIST);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });

  return { pose };
}
