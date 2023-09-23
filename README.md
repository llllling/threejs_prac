# threejs

## Scene

- 영화로 치면 장면
- 씬안에는 조명, 배우 등 다양한 요소가 있다.
- threejs에서는 Mesh, Object3D, Light와 같은 3차원 오브젝트로 표현됨.

## Camera

- 카메라로 위의 scene을 담는다.

### PerspectiveCamera

    * 사람의 눈이 바라보는 방식과 비슷한 원근감을 이용한 카메라

### OrthographicCamera

    * 물체가 카메라로 부터 얼마나 멀리있냐에 따른 원근감이 제거된 카메라
    * 주로 스타크래프트나 롤과 같은 전자시뮬레이션을 게임을 만들때 사용되는 카메라

## Renderer

- 카메라로 scene을 담았다면 그 결과물을 관객에게 보여줄때 TV나 영화 스크린과 같은 매체를 이용하는데, 이러한 역할을 하는 것이 Renderer
