import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";


// SCENE
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x90CDFF, -5, 250);


// HDR ENVIRONMENT
const hdrLoader = new HDRLoader();
hdrLoader.load('/qwantani_sunset_puresky_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});


// LIGHTING
const hemiLight = new THREE.HemisphereLight(0xFFF4C5, 0x444444, 3);
hemiLight.position.set(0, 100, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 300;
dirLight.shadow.camera.top = 80;
dirLight.shadow.camera.bottom = -80;
dirLight.shadow.camera.left = -80;
dirLight.shadow.camera.right = 80;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);


// CAMERA
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-5, 6, 40);


// RENDERER
const canvas = document.querySelector("#canvasThree");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-3, 10, 0);
controls.update();


// LOADERS
const gltfLoader = new GLTFLoader();

// ✅ DRACO SETUP (IMPORTANT)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
gltfLoader.setDRACOLoader(dracoLoader);


// MIXERS
let bananaMixer;
let bananaSceneMixer;
let vogelBananeMixer;
let vogelLuftMixer;


// SPEED VARIABLES
let bananaSpeed = 1;
let bananaSceneSpeed = 1;
let vogelBananeSpeed = 1;
let vogelLuftSpeed = 1;


// ---------------- BANANA SCENE ----------------
gltfLoader.load('/models/model_monkey_banana_Scene.glb', (gltf) => {

  const bananaScene = gltf.scene;
  bananaScene.scale.set(5, 5, 5);

  bananaScene.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(bananaScene);

  bananaSceneMixer = new THREE.AnimationMixer(bananaScene);

  if (gltf.animations.length > 0) {
    bananaSceneMixer.clipAction(gltf.animations[0]).play();
  }
});


// ---------------- BANANA ----------------
gltfLoader.load('/models/model_monkey_banana.glb', (gltf) => {

  console.log("BANANA ANIMATIONS:", gltf.animations);

  const banana = gltf.scene;
  banana.scale.set(5, 5, 5);

  banana.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(banana);

  bananaMixer = new THREE.AnimationMixer(banana);

  const clip = THREE.AnimationClip.findByName(gltf.animations, 'Banana_Schwanken_Y');

  if (clip) {
    bananaMixer.clipAction(clip).play();
  } else if (gltf.animations.length > 0) {
    bananaMixer.clipAction(gltf.animations[0]).play();
  }
});


// ---------------- VOGEL BANANE ----------------
gltfLoader.load('/models/model_vogel_banane.glb', (gltf) => {

  const vogelBanane = gltf.scene;
  vogelBanane.scale.set(5, 5, 5);

  vogelBanane.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(vogelBanane);

  vogelBananeMixer = new THREE.AnimationMixer(vogelBanane);

  const clip = THREE.AnimationClip.findByName(gltf.animations, 'Vogel_Banane_Schwingen');
  if (clip) {
    vogelBananeMixer.clipAction(clip).play();
  } else if (gltf.animations.length > 0) {
    vogelBananeMixer.clipAction(gltf.animations[0]).play();
  }
});


// ---------------- VOGEL FLIEGEN ----------------
gltfLoader.load('/models/model_vogel_fliegen.glb', (gltf) => {

  const vogelLuft = gltf.scene;
  vogelLuft.scale.set(5, 5, 5);

  vogelLuft.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(vogelLuft);

  vogelLuftMixer = new THREE.AnimationMixer(vogelLuft);

  const clip = THREE.AnimationClip.findByName(gltf.animations, 'Vogel_Fliegen');
  if (clip) {
    vogelLuftMixer.clipAction(clip).play();
  } else if (gltf.animations.length > 0) {
    vogelLuftMixer.clipAction(gltf.animations[0]).play();
  }
});


// FLOOR
const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(700, 700),
  new THREE.MeshPhongMaterial({ color: 0x90CDFF, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
mesh.position.y = -0.01;
scene.add(mesh);


// GUI
const gui = new GUI();

gui.add({ bananaSpeed }, 'bananaSpeed', 0, 5)
  .step(0.1)
  .name('Banana Speed')
  .onChange(v => bananaSpeed = v);

gui.add({ vogelBananeSpeed }, 'vogelBananeSpeed', 0, 5)
  .step(0.1)
  .name('Bird Banana Speed')
  .onChange(v => vogelBananeSpeed = v);

gui.add({ vogelLuftSpeed }, 'vogelLuftSpeed', 0, 5)
  .step(0.1)
  .name('Flying Bird Speed')
  .onChange(v => vogelLuftSpeed = v);


// ANIMATE
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (bananaMixer) bananaMixer.update(delta * bananaSpeed);
  if (bananaSceneMixer) bananaSceneMixer.update(delta * bananaSceneSpeed);
  if (vogelBananeMixer) vogelBananeMixer.update(delta * vogelBananeSpeed);
  if (vogelLuftMixer) vogelLuftMixer.update(delta * vogelLuftSpeed);

  controls.update();
  renderer.render(scene, camera);
}
animate();
