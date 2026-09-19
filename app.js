import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050816, 9, 20);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
camera.position.set(0, 0.5, 8);

const group = new THREE.Group();
scene.add(group);

const ambient = new THREE.AmbientLight(0x9bb0ff, 1.5);
scene.add(ambient);

const pointLightA = new THREE.PointLight(0x7c9bff, 24, 30, 2);
pointLightA.position.set(4, 4, 6);
scene.add(pointLightA);

const pointLightB = new THREE.PointLight(0x8ef0d4, 20, 25, 2);
pointLightB.position.set(-4, -2, 5);
scene.add(pointLightB);

const geometry = new THREE.IcosahedronGeometry(1.6, 1);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x7c9bff,
  emissive: 0x1b285c,
  metalness: 0.6,
  roughness: 0.22,
  transparent: true,
  opacity: 0.92,
  transmission: 0.35,
  thickness: 0.8,
  clearcoat: 1,
});

const orb = new THREE.Mesh(geometry, material);
orb.rotation.set(0.8, 1.2, 0.3);
group.add(orb);

const shellGeometry = new THREE.TorusKnotGeometry(1.9, 0.42, 180, 32);
const shellMaterial = new THREE.MeshStandardMaterial({
  color: 0x8ef0d4,
  emissive: 0x153f3a,
  metalness: 0.56,
  roughness: 0.38,
  wireframe: true,
});

const shell = new THREE.Mesh(shellGeometry, shellMaterial);
shell.scale.set(1.08, 1.08, 1.08);
group.add(shell);

const particleCount = 1400;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 18;
  positions[i3 + 1] = (Math.random() - 0.5) * 18;
  positions[i3 + 2] = (Math.random() - 0.5) * 18;
}

const particles = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({
    color: 0xdfe8ff,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
  })
);
particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
scene.add(particles);

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const resize = () => {
  const container = canvas.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();

const tick = () => {
  const elapsed = clock.getElapsedTime();
  orb.rotation.x = elapsed * 0.4 + 0.8;
  orb.rotation.y = elapsed * 0.7 + 1.2;
  shell.rotation.x = -elapsed * 0.55;
  shell.rotation.y = elapsed * 0.8;

  group.position.x = pointer.x * 0.8;
  group.position.y = pointer.y * 0.6;
  group.rotation.z = pointer.x * 0.6;
  particles.rotation.y = elapsed * 0.06;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
