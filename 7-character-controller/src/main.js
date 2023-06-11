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
  // renderer.outputColorSpace = THREE.Co;
  renderer.shadowMap.enabled = true;

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
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
  });
  scene.add(model);

  camera.lookAt(model.position);

  const planGeometry = new THREE.PlaneGeometry(10000, 10000, 10000);
  const planMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
  });
  const plane = new THREE.Mesh(planGeometry, planMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7.5;
  plane.receiveShadow = true;
  scene.add(plane);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);
  hemisphereLight.position.set(0, 20, 10);
  scene.add(hemisphereLight);

  const spotLight = new THREE.SpotLight(
    0xffffff,
    1.5,
    30,
    Math.PI * 0.15,
    0.5,
    0.5
  );
  spotLight.position.set(0, 20, 0);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 8;

  scene.add(spotLight);

  const mixer = new THREE.AnimationMixer(model);

  const buttons = document.querySelector(".actions");

  let currentAction;

  const combatAnimations = gltf.animations.slice(0, 5);
  const dancingAnimations = gltf.animations.slice(5);

  combatAnimations.forEach((animation) => {
    const button = document.createElement("button");

    button.innerText = animation.name;
    buttons.appendChild(button);
    button.addEventListener("click", () => {
      const previousAction = currentAction;

      //클릭한 애니메이션 추가
      currentAction = mixer.clipAction(animation);

      if (previousAction !== currentAction) {
        //현재 재생중인 애니메이션이 자연스럽게 멈추도록
        //인자로 넣은 시간만큼 천천히 애니메이션 멈춤
        previousAction.fadeOut(0.5);

        currentAction.reset().fadeIn(0.5).play();
      }
    });
  });

  if (gltf.animations.length > 0) {
    currentAction = mixer.clipAction(gltf.animations[0]);
    currentAction.play();
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const clock = new THREE.Clock();
  render();
  function render() {
    const delta = clock.getDelta();
    mixer.update(delta);
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

  function handlePointerDown(e) {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    //처음 교차된 오브젝트의 값만 필요해서 아래처럼 가져옴.
    const object = intersects[0]?.object;

    if (object?.name === "Ch46") {
      const previousAction = currentAction;
      const index = Math.round(Math.random() * (dancingAnimations.length - 1));
      currentAction = mixer.clipAction(dancingAnimations[index]);

      currentAction.loop = THREE.LoopOnce;
      //애니메이션이 마지막 프레임에서 멈추도록
      currentAction.clampWhenFinished = true;

      if (previousAction !== currentAction) {
        previousAction.fadeOut(0.5);

        currentAction.reset().fadeIn(0.5).play();
      }
      mixer.addEventListener("finished", handleFinished);
      function handleFinished() {
        mixer.removeEventListener("finished", handleFinished);

        const previousAction = currentAction;
        //애니메이션이 끝나고 다시 idle 액션으로 돌아오도록
        currentAction = mixer.clipAction(combatAnimations[0]);

        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
    }
  }
  window.addEventListener("pointerdown", handlePointerDown);
}
