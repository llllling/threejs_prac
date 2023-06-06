import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Card from "./Card";

window.addEventListener("load", function () {
  init();
});

function init() {
  const gui = new GUI();
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true,
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
  camera.position.z = 25;
  const controls = new OrbitControls(camera, renderer.domElement);
  //카드가 계속 회전하는 것 처럼 보이도록
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  //화면에 직접 드래그해서 회전시키는 속도, 기본값 1
  controls.rotateSpeed = 0.7;
  //관성
  controls.enableDamping = true;
  controls.enableZoom = false;
  // 회전각도 제한, 회전각도 기준 값 0~180도 사이
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;
  const card = new Card({
    width: 10,
    height: 15.8,
    radius: 0.5,
    color: "#0077ff",
  });
  // 살짝 기울어지게
  card.mesh.rotation.z = Math.PI * 0.1;
  scene.add(card.mesh);

  const cardFolder = gui.addFolder("Card");
  cardFolder
    .add(card.mesh.material, "roughness")
    .min(0)
    .max(1)
    .step(0.01)
    .name("material.roughness");
  cardFolder
    .add(card.mesh.material, "metalness")
    .min(0)
    .max(1)
    .step(0.01)
    .name("material.metalness");

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xfffff, 0.6);
  const directionalLight2 = directionalLight1.clone();
  directionalLight1.position.set(1, 1, 3);
  directionalLight2.position.set(-1, 1, -3);
  scene.add(directionalLight1, directionalLight2);

  render();

  function render() {
    renderer.render(scene, camera);
    controls.update();
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
