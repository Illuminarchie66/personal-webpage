//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(-5, 3, 5);
scene.add(sun);

// Texture loader
const loader = new THREE.TextureLoader();

const normal = loader.load('Earth_nrm.png');
normal.colorSpace = THREE.NoColorSpace;

const rough = loader.load('Earth_rgh.png');
rough.colorSpace = THREE.NoColorSpace;

const emmisive = loader.load('Earth_emm.png');
emmisive.colorSpace = THREE.NoColorSpace;

const metalness = loader.load('Earth_mtl.png');
metalness.colorSpace = THREE.NoColorSpace;

const material = new THREE.MeshStandardMaterial({
  map: loader.load('Earth_alb.png'),
  normalMap: normal,
  roughnessMap: rough,
  roughness: 0,
  emissiveMap: emmisive,
  emissive: new THREE.Color(0xffffff),
  metalnessMap: metalness,
  metalness: 0
});

//material.normalScale.set(1, -1);

// Important for 4096×1024 equirectangular textures
material.map.wrapS = THREE.RepeatWrapping;
material.map.repeat.x = 1; // flip horizontally if needed
material.roughnessMap.flipY = false;

// Sphere geometry
const geometry = new THREE.SphereGeometry(1, 128, 128);
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

const cloudMaterial = new THREE.MeshStandardMaterial({
  map: loader.load('EarthCloud02_alb.png'),
  alphaMap: loader.load('EarthCloud02_alb.png'), 
  normalMap: loader.load('EarthCloud02_nrm.png'),
  transparent: true,
  depthWrite: false
});

cloudMaterial.roughness = 1.0;
cloudMaterial.metalness = 0.0;
cloudMaterial.alphaTest = 0.01;
cloudMaterial.opacity = 0.9;
//cloudMaterial.normalScale.set(0.3, 0.3);

const cloudGeo = new THREE.SphereGeometry(1.01, 128, 128);
const clouds = new THREE.Mesh(cloudGeo, cloudMaterial);
scene.add(clouds);

const atmosphereGeo = new THREE.SphereGeometry(1.02, 128, 128);

const atmosphereMat = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    uniform vec3 glowColor;
    uniform float intensity;
    uniform float power;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - dot(vNormal, viewDir), power);
      gl_FragColor = vec4(glowColor, fresnel * intensity);
    }
  `,
  uniforms: {
    glowColor: { value: new THREE.Color(0x86e1fc) },
    intensity: { value: 0.12 },
    power: { value: 2 }
  },
  blending: THREE.AdditiveBlending,
  transparent: true,
  side: THREE.BackSide,
  depthWrite: false
});

const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
scene.add(atmosphere);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;     // smooth motion
controls.dampingFactor = 0.05;

controls.enablePan = false;        // no sideways drifting
controls.minDistance = 1.5;        // prevent clipping into planet
controls.maxDistance = 5.0;

controls.rotateSpeed = 0.6;
controls.zoomSpeed = 0.8;
controls.enableDamping = true;

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();   // required for damping

  planet.rotation.y += 0.0002;
  clouds.rotation.y += 0.0003;

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
