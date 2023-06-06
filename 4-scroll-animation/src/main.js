import * as THREE from "three";
window.addEventListener("load", function () {
  init();
});

function init() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true,
    canvas,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

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
