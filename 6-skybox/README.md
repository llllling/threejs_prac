# 3차원 공간

## 큐브맵 텍스처를 이용한 3차원 공간 표현

1. 매우 큰 BoxGeometry의 각 면에 3차원 텍스처 이미지를 적용하고 카메라를 그 내부에 두어 3차원 공간 표현

   - images 배열에 넣어주는 값 순서 중요

   * THREE.Mesh(geometry, materials) : material 적용부분에 배열로 넘겨주어 동일한 texture가 아닌 여러 texture 적용가능

```

  const textureLoader = new THREE.TextureLoader().setPath(
    "./assets/textures/Yokohama/"
  );
  const images = [
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ];
  const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
  const materials = images.map(
    (image) =>
      new THREE.MeshBasicMaterial({
        map: textureLoader.load(image),
        side: THREE.BackSide,
      })
  );

  const skybox = new THREE.Mesh(geometry, materials);
  scene.add(skybox);
```

2. scene의 background 속성을 이용해서 3차원 공간 표현

- cubeTextureLoader 이용

```
const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
    "./assets/textures/Yokohama/"
  );
  const images = [
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ];
  const cubeTexture = cubeTextureLoader.load(images);
  scene.background = cubeTexture;
```

## 360도 파노라마 텍스처를 이용한 3차원 공간 표현

- texture.mapping
  - 기본값은 UVMapping : 2차원 도형을 3차원도형으로 매핑하는 방식 중 하나
  * EquirectangularReflectionMapping : 환경 맵(아래에 설명 있음)과 사용하기 위한 옵션, 반사효과
  * EquirectangularRefractionMapping : 굴절효과

```
 const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/textures/village.jpg");
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
```

### 스피어 mesh에 파노라마 표현(스피어 주변 환경 표현)

- envMap : 주변 환경맵 정보
  - texture(위에서 읽어온 파노라마)를 이 속성에 입력해준다.

```
 const spherGeometary = new THREE.SphereGeometry(30, 50, 50);
  const spherMaterial = new THREE.MeshBasicMaterial({
    envMap: texture,
  });
  const spher = new THREE.Mesh(spherGeometary, spherMaterial);
  scene.add(spher);
```
