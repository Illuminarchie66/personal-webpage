import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/ColladaLoader.js';

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

const sunPivot = new THREE.Object3D();
scene.add(sunPivot);

const sun = new THREE.DirectionalLight(0xfff7ba, 2);
sun.position.set(-5, 3, 5);
sunPivot.add(sun);

// Planet
const loader = new THREE.TextureLoader();

const albedo = loader.load('earth/alb.png');
albedo.colorSpace = THREE.SRGBColorSpace;

const normal = loader.load('earth/norm.png');
normal.colorSpace = THREE.NoColorSpace;

const rough = loader.load('earth/rgh.png');
rough.colorSpace = THREE.NoColorSpace;

const emmisive = loader.load('earth/emm.png');
emmisive.colorSpace = THREE.NoColorSpace;

const metalness = loader.load('earth/mtl.png');
metalness.colorSpace = THREE.NoColorSpace;

const material = new THREE.MeshStandardMaterial({
  map: albedo,
  normalMap: normal,
  roughnessMap: rough,
  emissiveMap: emmisive,
  emissive: new THREE.Color(0xffff00),
  emissiveIntensity: 2,
  metalnessMap: metalness,
  displacementMap: loader.load('earth/displace.png'),
  displacementScale: 0.1,
});

material.map.wrapS = THREE.RepeatWrapping;
material.map.repeat.x = 1;
material.normalScale.set(-1, -1);

const geometry = new THREE.SphereGeometry(
  1, 512, 512,     
);  

const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// Clouds
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: loader.load('EarthCloud02_alb.png'),
  alphaMap: loader.load('EarthCloud02_alb.png'), 
  normalMap: loader.load('EarthCloud02_nrm.png'),
  transparent: true,
  depthWrite: false,
  roughness: 1.0,
  metalness: 0.0,
  alphaTest: 0.01,
  opacity: 0.9
});

const cloudGeo = new THREE.SphereGeometry(1.04, 128, 128);
const clouds = new THREE.Mesh(cloudGeo, cloudMaterial);
scene.add(clouds);

// Poles

// Atmosphere
const atmosphereGeometry = new THREE.SphereGeometry(1.035, 64, 64);

const atmosphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    glowColor: { value: new THREE.Color(0x4d99ff) }, 
    // intensity: { value: 1.5 },
    // power: { value: 2.5 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float intensity = pow(0.5 - dot(vNormal, viewDirection), 2.0);
      
      // Sky blue color with some cyan
      vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);
      
      gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true
});

const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Moon

// Skybox


// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enablePan = false;      
controls.minDistance = 1.5;        
controls.maxDistance = 5.0;

controls.rotateSpeed = 0.6;
controls.zoomSpeed = 0.8;
controls.enableDamping = true;

// Buttons

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update(); 

  sunPivot.rotation.y += 0.01;
  planet.rotation.y += 0.0002;
  clouds.rotation.y += 0.001;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
