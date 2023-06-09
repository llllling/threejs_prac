import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "lil-gui";
window.addEventListener("load", function () {
  init();
});

async function init() {
  const gui = new GUI();

  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    alpha: true,
    canvas
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
  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 15, 15);
  const waveMaterial = new THREE.MeshStandardMaterial({
    color: "#00ffff"
  });
  const wave = new THREE.Mesh(waveGeometry, waveMaterial);
  wave.rotation.x = -(Math.PI / 2);

  const initZPosition = [];
  const waveHeight = 2.5;
  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
    initZPosition.push(z);
  }
  const clock = new THREE.Clock();
  wave.update = () => {
    //사용자 컴퓨터마다 fps가 달라서 동일한 화면이더라도 애니메이션 재생속도 차이나기때문에 elapsedTime 사용
    const elapsedTime = clock.getElapsedTime();
    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      //i **2 : 정점마다 움직이는 높낮이 다르게 주기위해 i 이용, i만 주게되면 선형적으로 값이 증가하니까 물결이 규칙적인 모양을 가직 움직임 그래서 거듭제곱함
      const z =
        initZPosition[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight;

      waveGeometry.attributes.position.setZ(i, z);
    }
    // 정점의 좌표정보가 업데이트 되어야함을 ThreeJS에게 알려줘야함
    waveGeometry.attributes.position.needsUpdate = true;
  };
  scene.add(wave);

  const gLTFLoader = new GLTFLoader();
  const gltf = await gLTFLoader.loadAsync("./models/ship/scene.gltf");
  const ship = gltf.scene;

  //배가 위아래로 파도에 맞게 움직이는 것을 표현
  //시간에 따라 위아래로 움직일 수 있도록
  ship.update = () => {
    const elapsedTime = clock.getElapsedTime();
    ship.position.y = Math.sin(elapsedTime * 3);
  };

  ship.rotation.y = Math.PI;
  ship.scale.set(40, 40, 40);
  scene.add(ship);

  const ponitLight = new THREE.PointLight(0xfffff, 1);
  ponitLight.position.set(15, 15, 15);
  scene.add(ponitLight);

  const directionalLight = new THREE.DirectionalLight(0xfffff, 0.8);
  directionalLight.position.set(-15, 15, 15);
  scene.add(directionalLight);

  render();
  function render() {
    wave.update();
    ship.update();
    camera.lookAt(ship.position);
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
