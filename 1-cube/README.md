# cube 생성

## renderer 생성

- renderer.setSize() : 캔버스 크기 조정
- renderer.domElement : 3d 컨텐츠가 보여질 캔버스 돔 요소

```
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//  아래처럼 돔에 캔버스 돔 요소를 추가한다.
document.body.appendChild(renderer.domElement);
```

## scene 추가

```
const scene = new THREE.Scene();
```

## camera 추가(여기선 물체에 대한 원근감을 표한할 수 있는 카메라로 추가(카메라 종류다양함) )

- 각 파라미터 의미

1.  시야각(fov) => 이 각도 넓어지면 카메라에 더 많은 범위가 담기면서 어안렌즈같은 효과
2.  종횡비
3.  near : 카메라를 얼마나 가까이
4.  far : 카메라를 얼마나 멀리까지 볼수 있는지
    - 기본적으로 near ,far 이 범위를 벗어나는 물체들은 화면에 렌더링 되지 않는다.
    - 이 두옵션은 필수는 아니지만, 성능적인 문제와도 관련있기 때문에 적절한 값을 지정하여 불필요한 범위에 있는 물체들은 렌더링되지 않도록

```
const camera = new THREE.PerspectiveCamera(
 75,
 window.innerWidth / window.innerHeight,
 1,
 500
);
```

## Mesh

일종의 3D 오브젝트로 직육면체나 구 또는 평면과 같은 도형을 어떤 재질을 사용해서 만들지 표현할 수 있는 오브젝트

- 도형 : geometry
- 재질 : material

### geometry

- IcosahedronGeometry : 20면체 도형

### material

- MeshBasicMaterial : 조명의 영향을 받지 않음.

```
 new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xcc99ff),
    // //불투명도 조절을 위해 transparent, opacity 함께 사용해야함
    // transparent: true,
    // opacity: 0.5,

    // wireframe: true, // meterial 뼈대, 골격 확인을 위한 용도
  });
```

- 빛에 반응하는 Material들(빛에 따른 다양한 효과 확인가능 ex. 그림자, 반사, 굴절 등)
  - MeshLambertMaterial
  * MeshPhongMaterial
    - MeshLambertMaterial이 내부적으로 사용하는 비교적 단순한 렌더링 모델에서는 물체가 빛을 받았을 때 생기는 반사점을 표현하는데 한계가 있음. MeshPhongMaterial 사용하면 이러한 부분 더 잘 표현할 수 있다고 함.
    - shininess 속성 : 빛의 반사점에 생기는 광택의 선명도 변경하는 속성
  * MeshStandardMaterial
    - PBR이라는 물리기반 렌더링 모델을 사용하는데 이 방식이 유니티와 언리얼 같은 많은 3D앱에서 사용하는 표준적인 방식이 되었음. 그래서 이름이 MeshStandardMaterial 된거임.
    * 표현해야하는 영역이 많은 만큼 성능적으로는 MeshLambertMaterial보다 떨어질 수 있음.
  * 다양한 저사양 화면까지 지원하기 위해선 필요에 따라 적절한 것을 골라서 사용.

## Scene에 Mash 추가 및 카메라 위치 설정

- scene에 Mesh 추가

```
 const cube = new THREE.Mesh(geometry, material);

 scene.add(cube);
```

- 위 처럼 추가만하면 화면에 보이지 않음.

* 기본적으로 3D오브젝트를 scene에 추가하고 따로 위치를 설정하지 않으면 3차원 공간의 원점에 놓여있음.

- 카메라 역시 동일하게 원점에 놓여있음. 즉, 카메라가 Mesh를 담을 수 없는 위치에 있다.

* 카메라가 Mesh를 시야에 담을 수 있도록 위치를 z축 방향 뒤로 이동시켜야 화면에 3D 오브젝트(Mesh)가 보인다

```
// camera.postion.z = 5;
camera.position.set(0, 0, 5);

//카메라 위치에 상관없이 항상 큐브가 자리한 위치를 바라보도록 설정
  camera.lookAt(cube.position);
```

## etc

### 애니메이션 등록 시 유의점

- 사용자 컴퓨터마다 fps가 달라서 동일한 화면이더라도 애니메이션 재생속도 차이남.

**동일한 재생속도를 위해 어떻게 해야할까 ?**

- 시간이란 건 어디에서나 동일하니까 Date.now() 이용해서 동일한 속도로 보이도록 만들어줌

```
// 애니메이션 안에서 cube 회전시키는 동작을 구현하는 경우
// Date.now() 밀리세컨드라서 너무 빠르게 회전해서 1000 나눠줌
  render();

  function render() {
    cube.rotation.x = Date.now() / 1000;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
```

- ThreeJS 에서 제공하는 Clock의 getElapsedTime 이용
  - getElapsedTime : clock 인스턴스가 생성된 시점으로부터 경과한 시간을 초단위로 반환

```
  const clock = new THREE.Clock();
  render();

  function render() {
    cube.rotation.x = clock.getElapsedTime();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
```

- ThreeJS 에서 제공하는 Clock의 getDelta 이용
  - getDelta : getDelta 호출되고나서 그 다음번에 다시 호출되기까지의 시간 간격을 반환
  * 절대적인 경과시간이 아니라 각 호출 사이의 간격을 반환하기 때문에 애니메이션 적용에 사용하려면 아래처럼 계속 더해주는 형태로 사용

```
  const clock = new THREE.Clock();
  render();

  function render() {
    cube.rotation.x += clock.getDelta();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
```
