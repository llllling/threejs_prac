import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

function init() {
  //renderer 생성
  const renderer = new THREE.WebGL1Renderer({
    // alpha: true,
    antialias: true, //계단현상 제거
  });
  //캔버스 크기 조정
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.domElement : 3d 컨텐츠가 보여질 캔버스 돔 요소
  // 아래처럼 돔에 캔버스 돔 요소를 추가한다.
  document.body.appendChild(renderer.domElement);

  //씬 추가
  const scene = new THREE.Scene();

  //카메라추가(여기선 물체에 대한 원근감을 표한할 수 있는 카메라로 추가(카메라 종류다양함) )
  /**
   * 각 파라미터 의미
   * 1. 시야각(fov) => 이 각도 넓어지면 카메라에 더 많은 범위가 담기면서 어안렌즈같은 효과
   * 2. 종횡비
   * 3. near
   * 4. far
   */
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  //MeshBasicMaterial 조명의 영향을 받지않음

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xcc99ff),
    // //불투명도 조절을 위해 transparent, opacity 함께 사용해야함
    // transparent: true,
    // opacity: 0.5,

    // wireframe: true, // meterial 뼈대, 골격 확인을 위한 용도
  });
  // 위 처럼 생성할 때 값을 줄 수도 있지만 아래처럼 추가도 가능
  // material.color = new THREE.Color(0xcc99ff);

  const cube = new THREE.Mesh(geometry, material);
  //씬에 cube 추가
  scene.add(cube);

  //기본적으로 씬에 추가한다고 보이지않음 카메라 위치를 조정해서
  // camera.postion.z = 5;
  camera.position.set(3, 4, 5);

  //카메라 위치에 상관없이 항상 큐브가 자리한 위치를 바라보도록 설정
  camera.lookAt(cube.position);
  const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1);
  directionalLight.position.set(-1, 2, 3);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  ambientLight.position.set(3, 2, 1);
  scene.add(ambientLight);

  renderer.render(scene, camera);
}
