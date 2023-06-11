import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
window.addEventListener("load", function () {
  init();
});

async function init() {
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 5, 20);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 3;

  const progressBar = document.querySelector("#progress-bar");
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded / total) * 100;
  };
  loadingManager.onLoad = () => {
    progressBar.parentElement.style.display = "none";
  };

  const gltfLoader = new GLTFLoader(loadingManager);
  const gltf = await gltfLoader.loadAsync("./models/character.gltf");
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);
  scene.add(model);

  camera.lookAt(model.position);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);
  hemisphereLight.position.set(0, 20, 10);
  scene.add(hemisphereLight);
  render();

  function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener("resize", handleResize);
}
