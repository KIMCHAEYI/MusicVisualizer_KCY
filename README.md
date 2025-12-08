# 🎄 Christmas Music Visualizer

음악의 **Amplitude(음량)** 와 **FFT(주파수 스펙트럼)** 데이터를 활용해 
트리 장식, 색상 분위기, 원형 파형 등이 실시간으로 변화하도록 제작하였습니다. 

---

## ✨ Features

### 1. Audio Reactive Elements

* **Amplitude 분석**

  * 전체 볼륨에 따라 팔레트 색상이 전환
  * 장식(오너먼트, 별) 크기·밝기가 부드럽게 변화

* **FFT 분석**

  * 트리 뒤에서 원형으로 전개되는 파형(Circular Spectrum Ring) 구현
  * 트리 장식 일부는 주파수 대역 에너지에 반응

---

### 2. Visual Components

* **크리스마스 트리(삼각형 레이어)**

  * 테두리 없이 단색으로 구성

* **가랜드(Garlands)**

  * 전구 줄이 고정된 경로 위에서 부드럽게 흔들리며 밝기 변화

* **오너먼트(Ornaments)**

  * 개별 주파수 대역을 매핑해 크기/밝기 변화
  * 자연스러운 흔들림 효과 포함

* **별(Star Top)**

  * FFT 기반 빛 퍼짐 효과, 회전 애니메이션

* **하늘 배경 + 별 + 눈(snow)**

  * 단순 그라디언트 배경
  * 별 깜빡임(twinkle)
  * 앞/뒤 레이어로 구성된 눈 낙하 효과

---

### 3. Interaction

* **Click** → 음악 재생 / 일시정지
* **S key** → 눈 효과 강도 조절 가능 

---

## 📁 File Structure

```
/project
│── index.html
│── sketch.js
│── music.mp3
└── README.md
```

---  
## 📌 Development Commit Flow

이 프로젝트는 아래 순서로 기능을 점진적으로 추가하면서 개발되었습니다.

1. 기본 p5.js 환경 + 사운드 로딩/재생
2. Amplitude 분석 + 단순 시각화
3. FFT 분석 + 원형 파형
4. 트리(실루엣) 구현
5. 장식(가랜드·오너먼트·별) 추가 + 눈/배경/팔레트 시스템 정리 및 최종 조정
