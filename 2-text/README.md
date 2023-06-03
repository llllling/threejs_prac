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

## 텍스처 추가

- material.map 속성에 load한 texture 추가

* setPath함수를 통해 기본 dir 경로 설정 가능

```
const textureLoader = new THREE.TextureLoader().setPath("./assets/textures/");
  const textTexture = textureLoader.load("holographic.jpeg");

  const textMaterial = new THREE.MeshPhongMaterial();
  textMaterial.map = textTexture;
```