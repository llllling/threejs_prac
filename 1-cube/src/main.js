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

  const cubeGeometry = new THREE.IcosahedronGeometry(1);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    emissive: 0x111111,
  });
  // 위 처럼 생성할 때 값을 줄 수도 있지만 아래처럼 추가도 가능
  // material.color = new THREE.Color(0xcc99ff);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color: 0xaaaaaa,
  });
  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);
  //씬에 cube 추가
  scene.add(cube, skeleton);

  //기본적으로 씬에 추가한다고 보이지않음 카메라 위치를 조정해서
  camera.position.z = 5;

  //카메라 위치에 상관없이 항상 큐브가 자리한 위치를 바라보도록 설정
  // camera.lookAt(cube.position);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    // 각도를 라디안으로 변환해서 넣어줌
    // cube.rotation.x = THREE.MathUtils.degToRad(45);

    // cube.rotation.x = Date.now() / 1000;
    // cube.rotation.x = clock.getElapsedTime();
    // cube.rotation.x += clock.getDelta();

    const elapsedTime = clock.getElapsedTime();
    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    // cube보다 빠르게 회전
    skeleton.rotation.x = elapsedTime * 1.5;
    skeleton.rotation.y = elapsedTime * 1.5;
    /*sin 함수의 값은 항상 -1 ~ 1 사이를 반복해서 움직임.
    그래서 그냥 cube.rotation.x 값 너어줌.*/
    // cube.rotation.y = Math.sin(cube.rotation.x);
    /* 크기 변경 */
    // cube.scale.x = Math.cos(cube.rotation.x);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //이걸 반드시 호출해줘야 변경된 설정값 적용됨.
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener("resize", handleResize);
}
