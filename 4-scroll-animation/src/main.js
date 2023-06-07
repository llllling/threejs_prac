import * as THREE from "three";
import { GUI } from "lil-gui";
window.addEventListener("load", function () {
  init();
});

function init() {
  const gui = new GUI();

  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true,
    canvas,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);
  gui.add(scene.fog, "near").min(0).max(100).step(0.1);
  gui.add(scene.fog, "far").min(100).max(500).step(0.1);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 25, 150);
  //Plane Mesh 뿐 아니라 모든 Mesh가 여러 삼각형의 합으로 이루어져있음
  //더 많은 정점을 위해 Segments값도 150으로 크게
  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    color: "#00ffff",
  });
  const wave = new THREE.Mesh(waveGeometry, waveMaterial);
  wave.rotation.x = -(Math.PI / 2);

  const waveHeight = 2.5;
  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
  }
  scene.add(wave);

  const ponitLight = new THREE.PointLight(0xfffff, 1);
  ponitLight.position.set(15, 15, 15);
  scene.add(ponitLight);

  const directionalLight = new THREE.DirectionalLight(0xfffff, 0.8);
  directionalLight.position.set(-15, 15, 15);
  scene.add(directionalLight);

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
