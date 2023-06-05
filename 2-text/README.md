# 3D Text

- ThreeJS에서 Text형태의 geometry만들 땐 Textgeometry 사용할 수 있음.

- Textgeometry 생성할 때 어떠한 폰트 사용할지 전달해줘야하는 데, 폰트 형식은 typeface라는 형식의 폰트 전달해야함.

## Font 적용

```
//기본 제공 폰트, 그러나 한글 지원 안됨. 한글 생성하려고 하면 전부 깨짐
import typeface from 'three/examples/fonts';
```

**기본제공폰트 이외의 폰트를 적용하고 싶다면 ? => 일반 폰트파일을 typeface로 변환해서 사용**
https://gero3.github.io/facetype.js/ 여기서 변환 가능

- 변환한 파일을 아래처럼 로드해서 사용

```
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

  const fontLoader = new FontLoader();
  fontLoader.load("./assets/fonts/The Jamsil 3 Regular_Regular.json", (font) => {
     console.log("load", font);
  });
  /*
   const font =  fontLoader.loadAsync("./assets/fonts/The Jamsil 3 Regular_Regular.json")
   */
```

```
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import typeface from "./assets/fonts/The Jamsil 3 Regular_Regular.json";

  const fontLoader = new FontLoader();
  fontLoader.parse(typeface);
```

## TextGeometry 생성

- text 경사면은 기본적으로 각이 서있음. 부드럽게 만들어주기 위한 옵션이 bevel관련 속성들
  - bevel관련 속성들은 모두 TextGeometry의 상위 클래스 개념인
    ExtrudeGeometry에서 제공하는 속성들임.

```
 const textGeometry = new TextGeometry("안녕하세요.", {
    font,
    size: 0.5,
    height: 0.1,
    //text 경사면 설정하기 위해
    bevelEnabled: true,
    bevelSegments: 5,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });
```

## Text BoundingBox

화면에서 시각적으로 보이진 않지만 Textgeometry의 경계 영역을 감싸고 있는 직육면체 형태의 경계선을 나타내는 상자

- boundingbox의 정보는 textGeometry.boundingBox 로 접근 가능. 기본적으로 계산된 속성이 아니라서 초기값은 null이다.
- 명시적으로 bondingbox를 계산하라는 명령 textGeometry.computeBoundingBox()을 실행해야 알 수 있음

* boundingbox의 속성
  - min : boundingbox의 시작
  - max : boundingbox의 끝

```
const textGeometry = new TextGeometry("안녕하세요.", {
    font,
    size: 0.5,
    height: 0.1,
  });

  textGeometry.computeBoundingBox();
  const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00c896 });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);
```

## Text 화면 가운데 정렬

- 화면의 정중앙이 Text의 시작점이라서 전체적을 봤을 때 Text가 오른쪽에 위치한 상태임.

* textGeometry.translate 이용
  - textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x : text의 너비
  - text의 너비에 반 길이만큼 x축 이동하면 x축 기준 가운데로옴
  - 나머지 y,z도 그렇게 계산해서 화면 정 중앙에 배치

```
   textGeometry.computeBoundingBox();
   textGeometry.translate(
     -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
     -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
     -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5
   );
```

- center 함수이용

```
  textGeometry.center();
```

## Texture 추가

- material.map 속성에 load한 texture 추가

* setPath함수를 통해 기본 dir 경로 설정 가능

```
const textureLoader = new THREE.TextureLoader().setPath("./assets/textures/");
  const textTexture = textureLoader.load("holographic.jpeg");

  const textMaterial = new THREE.MeshPhongMaterial();
  textMaterial.map = textTexture;
```

## SpotLight

- SpotLight() 파라미터 순서
  1. 빛의 색상
  2. 빛의 강도
  3. 빛이 닫는 거리(distance)
  4. 빛이 퍼지는 각도(angle)
  5. 빛이 감쇄하는 정도(빛의 경계가 선명하고 흐릿하고)(penumbra)
  6. 빛의 거리에 따라 빛이 희미해지는 정도(dekay)

```
 const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.2, 0.5)
```

- mouse interaction 추가 : 마우스의 움직임이 맞춰 빛을 비추는 target 변경

```
 //target 기본 정중앙
  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.2, 0.5)
  spotLight.target.position.set(0, 0, -3);
  scene.add(spotLight, spotLight.target);

  window.addEventListener("mousemove", (e) => {
    //e.clientX/Y 값은 절대값임. threejs의 좌표계와 다름
    // 그래서 화면에서 상대적인 값 구해서 threejs 좌표계에 맞게 변경
    // 움직이는 범위 늘리기 위해 * 5
    const x = (e.clientX / window.innerWidth - 0.5) * 5;
    const y = -(e.clientY / window.innerHeight - 0.5) * 5;

    spotLight.target.position.set(x, y, -3);
  });
```

## 그림자

- 그림자를 만들기 위해선 renderer에 그림자 맵을 사용하겠단 설정을 먼저 해주어야함.

```
  //그림자 맵 사용하겠다.
  renderer.shadowMap.enabled = true;
```

- 그림자를 드리우게
  - TextGeometry에 설정
  * 모든 종류의 light가 그림자를 생기게 하는거 아니지만, spotLight는 그림자를 드리울 수 있는 조명 중 하나

```
  text.castShadow = true;
  spotLight.castShadow = true;
```

- 그림자를 받도록
  - 해당 예제에선 TextGeometry에 뒤에 있는 PlaneGeometry에 설정

```
  plane.receiveShadow = true;
```

- 그림자의 해상도 조정
  - default : 512
  * 높게 설정하면 렌더링 성능에 영향을 주니까 적당한 값 설정

```
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
```

- 그림자 블러 효과(선명하게 흐릿하게)

```
 spotLight.shadow.radius = 10;
```
