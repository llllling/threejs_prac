# 파티클 애니메이션

## 텍스처 적용

텍스처 적용하니까 뒤에 있는 파티클들이 앞에 있는 파티클에 가려져서 부자연스러워 보여서 아래 코드처럼 material 속성 설정

- material.alphaMap : 표면 전체의 불투명도를 제어

* material.depthWrite : 기본값은 true,depth 버퍼라는 곳에 각 파티클을 랜더할 때마다 깊이 정보가 저장되게 되는데 이걸 비활성화 시켜서 모든 파티클이 같은 계층에서 표현되도록 하면서 뒤에 놓은 텍스처가 앞에 놓인 텍스처에 가려지는 현상제거

```
 const textureLoader = new THREE.TextureLoader();
 const texture = textureLoader.load("./assets/textures/particle.png");
 material.alphaMap = texture;
 material.transparent = true;
 material.depthWrite = false;
```
