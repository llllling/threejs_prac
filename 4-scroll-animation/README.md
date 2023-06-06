# object와 Scroll event 연동

Plane Mesh 뿐 아니라 모든 Mesh가 여러 삼각형의 합으로 이루어져있음

```
  const waveGeometry = new THREE.PlaneGeometry(5, 5, 5, 5);
  const waveMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
  });
  const wave = new THREE.Mesh(waveGeometry, waveMaterial);
// x 축으로 살짝 눕히게
  wave.rotation.x = -(Math.PI / 3);
```

![Mesh](./readme_image.png)

## 파도만들기

두 가지 방식이 있음

1. 위 이미지의 각 정점들이 있는데, 그 정점의 z 좌표 값을 조절해주어 파도처럼 보이도록 만들어 준다.

   - waveGeometry.attributes.position.array : 각 정점들의 좌표정보를 가지고 있음 [x, y, z, x, y, z, ...]

```
  //더 많은 정점을 위해 Segments값도 150으로 크게
  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: "#00ffff",
  });
  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  // 90도로 완전히 눕힘
  wave.rotation.x = -(Math.PI / 2);

 const waveHeight = 2.5;
  for (let i = 0; i < waveGeometry.attributes.position.array.length; i += 3) {
    //각 정점의 z좌표만 변경
    // Math.random() : 0 ~ 1사이의 랜덤값 반환 , -0.5를 하여 -0.5 ~ 0.5 사이의 값을 반환하도록, 그리고 대략적인 값으로(waveHeight)  파도높이의 범위 설정
    waveGeometry.attributes.position.array[i + 2] += (Math.random() - 0.5) * waveHeight;
  }
  scene.add(wave);
```

2. 위의 코드에서 array.length 대신 count사용, getZ/setZ 이용
   - count : 정점의 갯수

```
const waveHeight = 2.5;
  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
```
