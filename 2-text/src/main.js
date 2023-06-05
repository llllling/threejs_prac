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
  camera.position.set(0, 1, 5);

  new OrbitControls(camera, renderer.domElement);

  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync(
    "./assets/fonts/The Jamsil 3 Regular_Regular.json"
  );

  const textGeometry = new TextGeometry("Three.js Text 3D Web", {
    font,
    size: 0.5,
    height: 0.1,
    //text 경사면 설정하기 위해
    bevelEnabled: true,
    bevelSegments: 5,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });
  textGeometry.center();

  const textureLoader = new THREE.TextureLoader().setPath("./assets/textures/");
  const textTexture = textureLoader.load("holographic.jpeg");

  //MeshPhongMaterial 빛이 없으면 아무것도 안보임
  const textMaterial = new THREE.MeshPhongMaterial();
  textMaterial.map = textTexture;
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(
    0xffffff,
    2.5,
    30,
    Math.PI * 0.15,
    0.2,
    0.5
  );
  spotLight.position.set(0, 0, 3);
  spotLight.target.position.set(0, 0, -3);
  scene.add(spotLight, spotLight.target);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  const spotLightFolder = gui.addFolder("SpotLight");
  spotLightFolder
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);
  spotLightFolder
    .add(spotLight.position, "z")
    .min(1)
    .max(10)
    .step(0.01)
    .name("position.z");
  spotLightFolder.add(spotLight, "distance").min(1).max(30).step(0.01);
  spotLightFolder.add(spotLight, "decay").min(0).max(10).step(0.01);
  spotLightFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01);

  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x00000,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -10;
  scene.add(plane);

  render();

  function render() {
    renderer.render(scene, camera);
    spotLightHelper.update();

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
