# QRnShort 프로젝트 개요 및 기능 명세서

## 1. 프로젝트 개요

- 프로젝트명: QRnShort (프로젝트06)
- 목적: URL 유틸리티 기능(QR코드 변환, URL 단축)을 한 곳에서 쓸 수 있는 웹
- 구성: HTML, CSS, JavaScript로만 만든 정적 웹 (서버 없음, GitHub Pages 배포)
- 프로젝트04(URL2QR) 결과물을 `url2qr` 폴더로 가져와 연결하고, `urlShort` 폴더에 URL 단축 기능을 새로 추가함

## 2. 폴더 구조

```
프로젝트06/
├── index.html          메인 화면 (스마트 툴박스)
├── style.css
├── url2qr/             QR코드 생성 (프로젝트04 결과물)
│   ├── img/logo.png
│   ├── index.html
│   ├── script.js
│   └── style.css
└── urlShort/           URL 단축 (새로 추가)
    ├── index.html
    ├── script.js
    └── style.css
```

## 3. 기능 명세

### 3-1. 메인 화면 (index.html)

| 기능 | 설명 |
|---|---|
| QR코드 생성 버튼 | 클릭하면 `url2qr/index.html`로 이동 |
| URL 단축 버튼 | 클릭하면 `urlShort/index.html`로 이동 |

### 3-2. QR코드 생성 (url2qr)

| 기능 | 설명 |
|---|---|
| 로고 | 화면 상단 좌측에 `img/logo.png` 표시 |
| URL 입력 | 화면 중앙의 입력창에 URL 입력 (http/https가 없으면 https를 붙임) |
| 생성하기 | 버튼 클릭 또는 Enter 키 → 입력창이 아래로 내려가고 정중앙에 QR코드 표시 |
| 다운로드 | QR코드를 클릭하면 `qrcode.jpg` 파일로 다운로드 |
| 배경 | 마우스 위치에 따라 그라데이션 색이 조금씩 바뀜 |
| 뒤로가기 | 메인 화면으로 이동 |

- 사용 라이브러리: qrcode.js (cdnjs)

### 3-3. URL 단축 (urlShort)

| 기능 | 설명 |
|---|---|
| URL 입력창 | 단축할 URL 입력 |
| 단축하기 버튼 | 입력 필드가 비어 있으면 비활성화, 입력하면 활성화 |
| 단축 요청 | 버튼 클릭 → 입력값을 URL 단축 OpenAPI로 요청 → 응답을 읽기 전용 출력 상자에 표시 |
| 복사 버튼 | 단축된 URL을 클립보드에 복사하고 "복사하였습니다" 알림 표시 |
| 뒤로가기 | 메인 화면으로 이동 |

- 사용 OpenAPI: is.gd (`https://is.gd/create.php?format=json&url=...`)
  - 브라우저에서 직접 호출하므로 CORS를 허용하는 API를 사용함
  - is.gd 응답이 없으면 clck.ru, v.gd 순서로 자동 재시도

## 4. 배포

- GitHub Pages: `https://ioria1004.github.io/vibeCoding_06_qrNshort/`
