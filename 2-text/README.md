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
