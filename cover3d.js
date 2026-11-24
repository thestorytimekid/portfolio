// The cover in real 3D. One bulb is the only light: it lights a chrome desk disco ball, the brads and the
// glasses, their real shadows fall on the page, and the ball throws moving sparkles across the paper.
// The page itself (paper, headline, type, links) stays as HTML underneath. Layout comes from the CSS boxes
// of the photo objects, which are the fallback (no WebGL, reduced motion, or the CDN failing).
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const cover = document.getElementById("cover");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (cover && !reduce) start().catch(e => console.warn("3D cover off:", e));

async function start() {
  const canvas = document.createElement("canvas");
  canvas.className = "three";
  cover.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;   // studio reflections for the chrome

  // one world unit = one CSS pixel on the page plane (z = 0); origin at the cover's centre, y up
  const camera = new THREE.PerspectiveCamera(26, 1, 10, 9000);
  let W = 1, H = 1, D = 1;
  const toWorld = (x, y) => new THREE.Vector3(x - W / 2, H / 2 - y, 0);
  // perspective: something at depth z looks bigger and further from the centre; undo that so it lands on its CSS box
  const k = z => (D - z) / D;
  const place = (obj, x, y, z) => { const p = toWorld(x, y); obj.position.set(p.x * k(z), p.y * k(z), z); return k(z); };

  /* ---------------- light ---------------- */
  const hemi = new THREE.HemisphereLight(0xfff3e2, 0x8a7f70, 0.5);
  scene.add(hemi);
  const bulbLight = new THREE.PointLight(0xffb066, 0, 0, 0);
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(512, 512);
  bulbLight.shadow.camera.near = 5; bulbLight.shadow.camera.far = 5000;
  bulbLight.shadow.bias = -0.0006; bulbLight.shadow.normalBias = 0.6;
  scene.add(bulbLight);
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ color: 0x2a1c0e, opacity: 0.3 }));
  catcher.receiveShadow = true;
  scene.add(catcher);

  /* ---------------- materials ---------------- */
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 1, roughness: 0.16 });
  const satin = new THREE.MeshStandardMaterial({ color: 0xc9ced4, metalness: 1, roughness: 0.34 });

  /* ---------------- the disco ball, on a little motorised chrome stand ---------------- */
  const disco = new THREE.Group(); scene.add(disco);
  const ball = new THREE.Group(); disco.add(ball);
  const grout = new THREE.Mesh(new THREE.SphereGeometry(.975, 48, 32), new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: .7 }));
  grout.castShadow = true; ball.add(grout);
  // mirror tiles in latitude rows, fewer per row towards the poles, each with a tiny random tilt so it glitters
  const tiles = [], rows = 26;
  for (let i = 0; i < rows; i++) {
    const lat = -Math.PI / 2 + (i + .5) / rows * Math.PI, n = Math.max(6, Math.round(Math.cos(lat) * rows * 2.05));
    for (let j = 0; j < n; j++) tiles.push([lat, (j + (i % 2) * .5) / n * Math.PI * 2]);
  }
  const tileSize = Math.PI / rows * .88;
  const mirror = new THREE.MeshStandardMaterial({ color: 0xeef1f4, metalness: 1, roughness: .05 });
  const tileMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(tileSize, tileSize, .02), mirror, tiles.length);
  tileMesh.castShadow = true;
  const tileN = [], tileP = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  tiles.forEach(([lat, lon], i) => {
    const nrm = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
    const look = new THREE.Matrix4().lookAt(new THREE.Vector3(), nrm, new THREE.Vector3(0, 1, 0));
    q.setFromRotationMatrix(look); q.multiply(new THREE.Quaternion().setFromEuler(e.set((rnd() - .5) * .07, (rnd() - .5) * .07, 0)));
    m4.compose(nrm.clone().multiplyScalar(.99), q, new THREE.Vector3(1, 1, 1));
    tileMesh.setMatrixAt(i, m4);
    tileN.push(new THREE.Vector3(0, 0, 1).applyQuaternion(q)); tileP.push(nrm.clone());
  });
  ball.add(tileMesh);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, .1, 24), chrome); cap.position.y = 1.0; ball.add(cap);
  const stand = new THREE.Group(); disco.add(stand);
  const sAdd = (g, y, m = chrome) => { const me = new THREE.Mesh(g, m); me.position.y = y; me.castShadow = true; stand.add(me); return me; };
  sAdd(new THREE.CylinderGeometry(.62, .7, .16, 64), .08, satin);          // motor base
  sAdd(new THREE.TorusGeometry(.66, .03, 12, 64), .16).rotation.x = Math.PI / 2;
  sAdd(new THREE.CylinderGeometry(.05, .05, .5, 16), .41);                 // spindle
  sAdd(new THREE.SphereGeometry(.09, 24, 16), .66);
  ball.position.y = 1.62;

  // sparkles: where the bulb's light bounces off each tile onto the page
  const SPARK = Math.min(tiles.length, 900);
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(SPARK * 3), sparkA = new Float32Array(SPARK);
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute("alpha", new THREE.BufferAttribute(sparkA, 1));
  const sparkMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uOn: { value: 1 }, uSize: { value: 14 }, uPR: { value: 1 } },
    vertexShader: `attribute float alpha; varying float vA; uniform float uSize, uPR;
      void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = uSize * uPR * (0.6 + alpha*0.7); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; uniform float uOn;
      void main(){ vec2 c = gl_PointCoord - .5; float d = length(c); float a = smoothstep(.5,.0,d); a = a*a;
        gl_FragColor = vec4(vec3(1.,.86,.62) * 1.4, a * vA * uOn * .55); }`
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat); sparks.frustumCulled = false; scene.add(sparks);

  /* ---------------- the bulb ---------------- */
  const pivot = new THREE.Group(); scene.add(pivot);
  const lamp = new THREE.Group(); pivot.add(lamp);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), new THREE.MeshStandardMaterial({ color: 0x141414, roughness: .85 }));
  lamp.add(cord);
  const socket = new THREE.Group(); lamp.add(socket);
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.07,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 3, side: THREE.FrontSide, depthWrite: false });
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xfff4e4, transparent: true, opacity: 0.1, side: THREE.BackSide, depthWrite: false });
  const glass = new THREE.Mesh(new THREE.BufferGeometry(), glassMat); lamp.add(glass);
  const glassRim = new THREE.Mesh(new THREE.BufferGeometry(), rimMat); lamp.add(glassRim);
  const filMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 1.45, 0.45), toneMapped: false });
  const filament = new THREE.Mesh(new THREE.BufferGeometry(), filMat); lamp.add(filament);
  const wires = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: 0x6b5a48, metalness: .6, roughness: .4 })); lamp.add(wires);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffb468, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  lamp.add(glow);
  // shadow-only stand-ins: they cast shadows but are never drawn (the photo bulb on top is what you see)
  const ghost = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  cord.material = ghost; cord.castShadow = true; glass.visible = false;   // the light sits inside the glass: it must not block it
  glassRim.visible = filament.visible = wires.visible = glow.visible = false;
  let builtFor = "";
  function buildBulb(bw, bh) {                          // sized from the CSS bulb box so the light and the pendulum match it
    const key = Math.round(bw) + "x" + Math.round(bh); if (key === builtFor) return; builtFor = key;
    const sTop = bh * .075, sBot = bh * .47, sr = bw * .2, gr = bw * .44, gTop = sBot, gH = bh * .53;
    cord.scale.set(3.2, H * 2, 3.2); cord.position.y = -sTop + H;
    socket.clear();
    const add = (g, y, m = chrome) => { const me = new THREE.Mesh(g, ghost); me.position.y = y; me.castShadow = true; socket.add(me); return me; };
    add(new THREE.CylinderGeometry(sr * .38, sr * .42, bh * .06, 32), -sTop - bh * .03);
    add(new THREE.CylinderGeometry(sr * .62, sr * .62, bh * .03, 48), -sTop - bh * .075);
    add(new THREE.CylinderGeometry(sr * 1.04, sr * 1.04, bh * .07, 64), -sTop - bh * .12, satin);
    const bodyH = sBot - sTop - bh * .14;
    add(new THREE.CylinderGeometry(sr * .96, sr * .96, bodyH, 64), -(sTop + bh * .155 + bodyH / 2));
    add(new THREE.TorusGeometry(sr * .97, bh * .006, 12, 64), -sBot + bh * .01).rotation.x = Math.PI / 2;
    const screw = add(new THREE.CylinderGeometry(sr * .14, sr * .14, sr * .12, 20), -(sBot - bh * .06));
    screw.rotation.x = Math.PI / 2; screw.position.z = sr * .98;
    // ST64 glass: round at the bottom
    const prof = [[.34, 0], [.36, .06], [.5, .22], [.75, .42], [.93, .58], [1, .7], [.98, .8], [.88, .9], [.66, .97], [.36, 1], [0, 1.012]];
    const lg = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r * gr, -gTop - y * gH)), 96);
    glass.geometry.dispose(); glass.geometry = lg; glassRim.geometry = lg;
    // squirrel-cage filament
    const pts = [], n = 9, fr = gr * .3, y0 = -gTop - gH * .28, y1 = -gTop - gH * .72;
    for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, top = i % 2 === 0;
      pts.push(new THREE.Vector3(Math.sin(a) * fr * (top ? .6 : 1), top ? y0 : y1, Math.cos(a) * fr * (top ? .6 : 1))); }
    filament.geometry.dispose();
    filament.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, "catmullrom", .05), 400, Math.max(.9, bw * .0058), 6, true);
    const stem = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -gTop - gH * .02, 0), new THREE.Vector3(0, y0 + gH * .05, 0), new THREE.Vector3(0, y1 + gH * .02, 0)]);
    wires.geometry.dispose(); wires.geometry = new THREE.TubeGeometry(stem, 40, Math.max(.6, bw * .004), 6, false);
    glow.position.set(0, (y0 + y1) / 2, 0); glow.scale.setScalar(bw * 2.1);
    lamp.userData.fil = (y0 + y1) / 2;
  }

  /* ---------------- brads ---------------- */
  const bradBoxes = [...cover.querySelectorAll(".brad")];
  const brads = bradBoxes.map(() => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), chrome);
    m.rotation.x = Math.PI / 2; m.castShadow = true; scene.add(m); return m;
  });

  /* ---------------- glasses (folded, lying on the page) ---------------- */
  const specs = new THREE.Group();            // not added: the photo glasses are used instead
  const wire = new THREE.MeshStandardMaterial({ color: 0xaeb3ba, metalness: 1, roughness: .22 });
  const shell = new THREE.MeshPhysicalMaterial({ color: 0x4a2410, roughness: .3, clearcoat: 1, clearcoatRoughness: .1 });
  const lens = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .06, roughness: .02, clearcoat: 1, envMapIntensity: 3, depthWrite: false });
  for (const sx of [-1, 1]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1, .022, 12, 96), wire); rim.position.x = sx * 1.1; specs.add(rim);
    const l = new THREE.Mesh(new THREE.CircleGeometry(.985, 64), lens); l.position.set(sx * 1.1, 0, -.01); specs.add(l);
    const hinge = new THREE.Mesh(new THREE.BoxGeometry(.14, .07, .05), wire); hinge.position.set(sx * 2.12, .06, -.02); specs.add(hinge);
    // the temple folds in behind the lens, straight across, ending in a tortoiseshell tip
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, 1.7, 8), wire);
    arm.rotation.z = Math.PI / 2; arm.position.set(sx * 1.27, .02 - (sx > 0 ? .06 : 0), -.07); specs.add(arm);
    const tip = new THREE.Mesh(new THREE.CapsuleGeometry(.045, .55, 6, 12), shell);
    tip.rotation.z = Math.PI / 2 + sx * .35; tip.position.set(sx * .18, -.1 - (sx > 0 ? .06 : 0), -.08); specs.add(tip);
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(.17, .022, 10, 40, Math.PI), wire); bridge.position.y = .2; specs.add(bridge);
  specs.traverse(o => { if (o.isMesh && o.material !== lens) o.castShadow = true; });

  /* ---------------- layout: follow the CSS boxes ---------------- */
  const discoBox = cover.querySelector(".can"), specBox = cover.querySelector(".glasses"), bulbBox = document.getElementById("bulb");
  let ballR = 100;
  function layout() {
    W = cover.clientWidth; H = cover.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    D = (H / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, D); camera.updateProjectionMatrix();
    catcher.scale.set(W * 1.3, H * 1.3, 1);
    sparkMat.uniforms.uPR.value = renderer.getPixelRatio();
    const cr = cover.getBoundingClientRect(), rel = el => { const r = el.getBoundingClientRect(); return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height }; };
    const c = rel(discoBox);
    ballR = c.w * .46;
    const z = ballR + 4, s = k(z);
    place(disco, c.x + c.w / 2, c.y + c.h, z);          // stands on the bottom of the box
    disco.scale.setScalar(ballR * s);
    sparkMat.uniforms.uSize.value = Math.max(7, ballR * .11);
    const g = rel(specBox);
    const gs = place(specs, g.x + g.w / 2, g.y + g.h / 2, 8);
    specs.scale.setScalar(g.w / 4.5 * gs); specs.rotation.z = THREE.MathUtils.degToRad(14);
    bradBoxes.forEach((el, i) => { const b = rel(el); const bs = place(brads[i], b.x + b.w / 2, b.y + b.h / 2, 2); brads[i].scale.set(b.w * .42 * bs, b.w * .16, b.w * .42 * bs); });
    buildBulb(bulbBox.offsetWidth, bulbBox.offsetHeight);
  }
  layout(); addEventListener("resize", layout);
  cover.classList.add("is3d");

  /* ---------------- drawing ---------------- */
  let visible = true, mx = .5, spin = 0, spinV = .0035;
  new IntersectionObserver(([en]) => visible = en.isIntersecting).observe(cover);
  addEventListener("pointermove", ev => mx = ev.clientX / innerWidth);
  const tmp = new THREE.Vector3(), wp = new THREE.Vector3(), wn = new THREE.Vector3(), Ld = new THREE.Vector3(), r = new THREE.Vector3(), nm = new THREE.Matrix3();
  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const L = window.LAMP; if (!L) return;
    if (Math.round(L.bw) + "x" + Math.round(L.bh) !== builtFor) layout();
    // the pendulum (CSS rotates clockwise for +deg with y down; in 3D that's -z)
    const zp = 420, s = place(pivot, L.ax, 0, zp);
    pivot.scale.setScalar(s);
    pivot.rotation.z = -THREE.MathUtils.degToRad(L.ang);
    pivot.updateMatrixWorld(true);
    tmp.set(0, lamp.userData.fil || 0, 0); lamp.localToWorld(tmp);
    bulbLight.position.copy(tmp);
    const on = Math.max(0, Math.min(1, L.on));
    bulbLight.intensity = 2.4 * on;
    hemi.intensity = .18 + .36 * on;
    scene.environmentIntensity = .22 + .3 * on;
    catcher.material.opacity = .06 + .18 * on;
    // the ball turns on its motor; the cursor nudges the speed
    spinV += ((.0028 + (mx - .5) * .006) - spinV) * .03;
    spin += spinV; ball.rotation.y = spin;
    disco.updateMatrixWorld(true);
    // sparkles: reflect the bulb off each tile; where the bounce heads back at the page, put a fleck of light
    nm.getNormalMatrix(ball.matrixWorld);
    let n = 0;
    for (let i = 0; i < tiles.length && n < SPARK; i++) {
      wn.copy(tileN[i]).applyMatrix3(nm).normalize();
      wp.copy(tileP[i]).applyMatrix4(ball.matrixWorld);
      Ld.copy(bulbLight.position).sub(wp).normalize();
      const ndl = wn.dot(Ld); if (ndl <= .05) continue;
      r.copy(wn).multiplyScalar(2 * ndl).sub(Ld);                // mirror bounce
      if (r.z > -.04) continue;                                   // heading away from the page
      const tt = -wp.z / r.z; const hx = wp.x + r.x * tt, hy = wp.y + r.y * tt;
      if (Math.abs(hx) > W * .7 || Math.abs(hy) > H * .7) continue;
      sparkPos[n * 3] = hx; sparkPos[n * 3 + 1] = hy; sparkPos[n * 3 + 2] = 1;
      sparkA[n] = Math.min(1, ndl * 1.4) * Math.min(1, -r.z * 3); n++;
    }
    for (let i = n; i < SPARK; i++) sparkA[i] = 0;
    sparkGeo.attributes.position.needsUpdate = true; sparkGeo.attributes.alpha.needsUpdate = true;
    sparkGeo.setDrawRange(0, n);
    sparkMat.uniforms.uOn.value = on;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  function glowTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d");
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,200,130,.55)"); g.addColorStop(.2, "rgba(255,170,80,.3)"); g.addColorStop(.55, "rgba(255,150,60,.08)"); g.addColorStop(1, "rgba(255,140,50,0)");
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
}
