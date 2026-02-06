import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

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
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const sunPivot = new THREE.Object3D();
scene.add(sunPivot);

const sun = new THREE.DirectionalLight(0xfff7ba, 2);
sun.position.set(-5, 3, 5);
sunPivot.add(sun);

// Planet
const loader = new THREE.TextureLoader();

const albedo = loader.load('Earth_alb.png');
albedo.colorSpace = THREE.SRGBColorSpace;

const normal = loader.load('Earth_nrm.png');
normal.colorSpace = THREE.NoColorSpace;

const rough = loader.load('Earth_rgh.png');
rough.colorSpace = THREE.NoColorSpace;

const emmisive = loader.load('Earth_emm.png');
emmisive.colorSpace = THREE.NoColorSpace;

const metalness = loader.load('Earth_mtl.png');
metalness.colorSpace = THREE.NoColorSpace;

const material = new THREE.MeshStandardMaterial({
  map: albedo,
  normalMap: normal,
  roughnessMap: rough,
  emissiveMap: emmisive,
  emissive: new THREE.Color(0xffff00),
  emissiveIntensity: 2,
  metalnessMap: metalness,
  displacementMap: loader.load('heightmap3.png'),
  displacementScale: 0.15,
});

material.map.wrapS = THREE.RepeatWrapping;
material.map.repeat.x = 1;
material.normalScale.set(-1, -1);
material.onBeforeCompile = (shader) => {
  shader.uniforms.time = { value: 0 };
  shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      transformed += normal * 0.01 * sin(position.y*10.0 + time);
    `
  );
  material.userData.shader = shader;
};


const geometry = new THREE.SphereGeometry(
  1, 256, 256,     
  0,              //phiStart    
  Math.PI * 2,   // phiLength (full rotation)
  Math.PI * 0.25, // thetaStart (25% down from south pole)
  Math.PI * 0.5   // thetaLength (covers middle 50%)
);
// const geometry = new THREE.SphereGeometry(1, 256, 256);
// const uv = geometry.attributes.uv;

// for (let i = 0; i < uv.count; i++) {
//   let u = uv.getX(i);
//   let v = uv.getY(i);
//   const lat = (v - 0.5) * Math.PI;
//   const newV = 0.5 + Math.sin(lat) * 0.5;
//   uv.setXY(i, u, newV);
// }

// uv.needsUpdate = true;

const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// Poles
const poleAlbedo = loader.load('EarthCloudSimple01_alb.png');
poleAlbedo.colorSpace = THREE.SRGBColorSpace;
poleAlbedo.flipY = false;

const poleNormal = loader.load('EarthCloudSimple01_alb.png');
poleNormal.colorSpace = THREE.NoColorSpace;
poleNormal.flipY = false;

const northPoleMaterial = new THREE.MeshStandardMaterial({
  map: poleAlbedo,
  alphaMap: poleAlbedo,
  normalMap: poleNormal,
  transparent: true,
  roughness: 1.0
});

const southPoleMaterial = new THREE.MeshStandardMaterial({
  map: loader.load('EarthCloudSimple01_alb.png'),
  alphaMap: loader.load('EarthCloudSimple01_alb.png'),
  normalMap: loader.load('EarthCloudSimple01_nrm.png'),
  transparent: true,
});

const northPoleGeometry = new THREE.SphereGeometry(
  1.05, 128, 128,     
  0, Math.PI * 2,  
  0, Math.PI * 0.5
);
const southPoleGeometry = new THREE.SphereGeometry(
  1.05, 128, 128,     
  0, Math.PI * 2,  
  Math.PI*0.5, Math.PI * 0.5
);
const northPole = new THREE.Mesh(northPoleGeometry, northPoleMaterial)
const southPole = new THREE.Mesh(southPoleGeometry, southPoleMaterial)
scene.add(northPole);
scene.add(southPole);

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

const cloudGeo = new THREE.SphereGeometry(1.07, 128, 128);
const clouds = new THREE.Mesh(cloudGeo, cloudMaterial);
scene.add(clouds);

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

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update(); 

  sunPivot.rotation.y += 0.01;
  planet.rotation.y += 0.0002;
  clouds.rotation.y += 0.001;
  northPole.rotation.y += 0.0001
  southPole.rotation.y -= 0.0001

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
