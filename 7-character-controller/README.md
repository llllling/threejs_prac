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
