# threejs 강의

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
