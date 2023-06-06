# 인터렉티브 카드

## 카드 양면 렌더링 설정

기본적으로 Material은 성능적인 이유로 앞면만 렌더링한다. side: THREE.DoubleSide 설정을 통해 양면모드 렌더링 하도록 함

```
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
    });
```

## 메탈 카드 느낌을 내기 위해 조명추가

AmbientLight만으로는 빛의 의해 표현되는 재질의 법칙이나 감속성을 잘 표현할 수 없기 때문에 DirectionalLight 추가

- AmbientLight
  - scene 내의 모든 object들에 전 방향에서 조명을 비춰준다.

* DirectionalLight
  - 태양광, 평행하게 이동하는 빛이다.
  - default로 빛은 항상 위에서 온다. 이를 바꿔주고 싶다면 position을 통해 위치를 변경한다.

```
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xfffff, 0.6);
  const directionalLight2 = directionalLight1.clone();
  directionalLight1.position.set(1, 1, 3);
  directionalLight2.position.set(-1, -1, -3);
  scene.add(directionalLight1, directionalLight2);

```

## 메탈 카드 재질 느낌을 내기 위해 Materail 속성 추가

- roughness : 값이 낮을 수록 빛이 반사하는 정도가 커짐(거울처럼)
- metalness : 값이 높아질 수록 메탈에 가깝게 표현

```
const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.5,
    });

```

## 카드 가장자리 둥글게 ShapeGeometry 사용 (2차원)

PlaneGeometry는 가장자리를 둥글게 하는 옵션이 없다.
그래서 원하는 형태의 도형을 만들 수 있는 ShapeGeometry 사용

- ShapeGeometry : **2차원** 공간의 도형만 그릴 수 있음

### Shape 만들기

- absarc() : 타원 모양(호)의 곡선을 그리는데 사용함
  - x, y : 호를 그리기 위한 중심점 좌표
  - radius: 부채꼴의 반지름 길이
  - startAngle, endAlgle: 부채꼴 시작각도 / 끝 각도, 각도는 x축의 양의 방향에 있다고 생각하고 이 축을 기준으로 반시계 방향으로 회전한 만큼의 양
  - clockwise : 부채꼴의 호를 그릴때 시계/반시계 방향으로 회전할 지

```
// Math.PI / 2 = 90도
// clockwise  = true 시계방향
   const shape = new THREE.Shape();
    const x = width / 2 - radius;
    const y = height / 2 - radius;
    shape
      .absarc(x, y, radius, Math.PI / 2, 0, true)
      .lineTo(x + radius, -y)
      .absarc(x, -y, radius, 0, -Math.PI / 2, true)
      .lineTo(-x, -(y + radius))
      .absarc(-x, -y, radius, -Math.PI / 2, Math.PI, true)
      .lineTo(-(x + radius), y)
      .absarc(-x, y, radius, Math.PI, Math.PI / 2, true);
```

### ShapeGeometry 생성

- 앞서만든 shape를 추가해서 생성

```
     const geometry = new THREE.ShapeGeometry(shape);
```

## 카드의 두께감 표현을 위해 ExtrudeGeometry 사용 (3차원)

- 앞서만든 shape를 추가해서 생성

* 경사면을 각지게 만들기 위해 bevelThickness 값조정( 기본값 0.2)

```
  const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.01,
      bevelThickness: 0.1,
    });
```

## 애니메이션 추가

### GSAP

애니메이션 라이브러리, GreenSock에서 만든 Animation Platform 이란 이름의 앞글자를 따서 GSAP 이라고 함.

- to() : 객체의 속성을 원하는 값으로 부드럽게 변경됨
  - duration : 애니메이션 진행시간(지속시간) 조정
  - ease: 좀 더 부드럽게 보이기 위한 애니메이션 타이밍함수

```
  gsap.to(card.mesh.rotation, {
    y: -(Math.PI * 4),
    duration: 2.5,
    ease: "back.out(4)",
  });

```
