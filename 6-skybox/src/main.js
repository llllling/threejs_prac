import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
window.addEventListener("load", function () {
  init();
});

function init() {
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
    10000
  );
  camera.position.z = 100;

  /* 큐브맵 텍스처를 이용한 3차원 공간 표현 1 */
  // //줌인 줌아웃 시 box 밖으로 안나가도록 min/max 설정
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 5;
  // controls.maxDistance = 100;

  // const textureLoader = new THREE.TextureLoader().setPath(
  //   "./assets/textures/Yokohama/"
  // );
  // const images = [
  //   "posx.jpg",
  //   "negx.jpg",
  //   "posy.jpg",
  //   "negy.jpg",
  //   "posz.jpg",
  //   "negz.jpg",
  // ];
  // const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
  // const materials = images.map(
  //   (image) =>
  //     new THREE.MeshBasicMaterial({
  //       map: textureLoader.load(image),
  //       side: THREE.BackSide,
  //     })
  // );

  // const skybox = new THREE.Mesh(geometry, materials);
  // scene.add(skybox);

  /* 큐브맵 텍스처를 이용한 3차원 공간 표현 2*/
  // new OrbitControls(camera, renderer.domElement);

  // const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
  //   "./assets/textures/Yokohama/"
  // );
  // const images = [
  //   "posx.jpg",
  //   "negx.jpg",
  //   "posy.jpg",
  //   "negy.jpg",
  //   "posz.jpg",
  //   "negz.jpg",
  // ];
  // const cubeTexture = cubeTextureLoader.load(images);
  // scene.background = cubeTexture;

  /** 360 파노라마 텍스처를 이용한 3차원 공간 표현 */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  //드래그 하는 순간 바로 멈추지 않고 관성효과
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/textures/village.jpg");
  //기본값은 UVMapping : 2차원 도형을 3차원도형으로 매핑하는 방식 중 하나
  texture.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = texture;

  const spherGeometary = new THREE.SphereGeometry(30, 50, 50);
  const spherMaterial = new THREE.MeshBasicMaterial({
    envMap: texture,
  });
  const spher = new THREE.Mesh(spherGeometary, spherMaterial);
  scene.add(spher);

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
