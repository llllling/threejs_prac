import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
window.addEventListener("load", function () {
  init();
});

async function init() {
  const gui = new GUI();
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.z = 5;
  new OrbitControls(camera, renderer.domElement);

  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync(
    "./assets/fonts/The Jamsil 3 Regular_Regular.json"
  );

  const textGeometry = new TextGeometry("안녕하세요.", {
    font,
    size: 0.5,
    height: 0.1,
  });
  //MeshPhongMaterial 빛이 없으면 아무것도 안보임
  const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00c896 });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  pointLight.position.set(3, 0, 2);
  scene.add(pointLight, pointLightHelper);
  gui.add(pointLight.position, "x").min(-3).max(3).step(0.1);

  render();

  function render() {
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
