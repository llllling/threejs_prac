# 3D 캐릭터 컨트롤러

## 애니메이션 재생

- animation mixer 사용
  - 인자로 애니메이션 재생할 model 입력
- mixer.clipAction: 애니메이션의 clip으로부터 애니메이션을 재생할 수 있는 액션객체 얻을 수 있음

* 실제로 반영하기 위해선 매 프레임마다 mixer.update() 해야함.
  - 인자로 delta값 넘겨줘야함.

```
 const mixer = new THREE.AnimationMixer(model);
  if (gltf.animations.length > 0) {
    // action : 애니메이션 액션 인스턴스
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }

  ...

  const clock = new THREE.Clock();

  function render() {
    const delta = clock.getDelta();
    mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
```

## Raycaster로 요소 클릭 감지하기

- Raycaster :3차원 공간안에서 마우스가 어느 요소 위에 있는 지 쉽게 감지할 수 있다.
  - 마우스가 올려진 지점으로부터 보이지 않는 직사광선을 쐈을 때 교차하는 물체가 있는 지 확인하는 기법
  * 마우스로 3차원 공간에 어느 지점을 클릭했을 때 그 지점을 향해 직사광선을 쏘아서 어떤 오브젝트와 교차하는 지점이 있었다면 해당 교차점에 대한 정보를 알려주는 게 Raycaster가 하는 역할

* setFromCamera()
  - 공간상에서 직사광선을 설정하기 위해선 서로 다른 2개의 점이 필요함
  * 하나는 클릭한 지점, 나머지는 카메라가 위치한 점으로 시작점이 설정된다는 뜻으로 메소드 이름이 setFromCamera이다.
  - 첫번째 파라미터 : x, y 좌표의 값은 각각 -1 ~ 1사이의 값이여야 한다.
    - (event.clientX / window.innerWidth - 0.5) \* 2 : -1 ~ 1 사이의 값을 주기 위한 계산식

```
   pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
   //threeJS에선 y좌표가 정점을 기준으로 아래쪽이 -, 위쪽이 + 이므로 -를 붙여준다
    pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;

    raycaster.setFromCamera(pointer, camera);
```

- intersectObjects() : 광선과 교차된 객체들 정보 얻을 수 있음

```
  const intersects = raycaster.intersectObjects(scene.children);
```
