# Src 폴더 구조

```
├── assets
│   // 이미지 파일 폴더
│   ├── background // 배경용 랜덤 핑구 gif 8개
│   ├── ...
│   └── pinga-door.gif  // 로그인 화면 배경
├── common
│   // 공통으로 사용하게 되는 파일들
│   ├── configData.ts   // 경로 등 상수들 정의
│   ├── states          // 전역 상태
│   ├── styles          // 스타일 파일
│   └── types           // 타입
├── components
│   // 페이지 제외한 컴포넌트들
│   // 기본적으로 페이지 단위로 폴더로 정리함
│   ├── auth    // 로그인 페이지 관련 컴포넌트
│   ├── card    // 카드 컴포넌트
│   ├── layout  // 레이아웃 컴포넌트
│   ├── modal   // Modal Base
│   ├── util    // 공통적으로 사용하는 컴포넌트
│   └── ...
├── pages
│   // 페이지 컴포넌트
│   ├── auth    // 로그인 관련 페이지
│   └── ...
└── util // 기타 유틸리티
    ├── useCheckLogin.ts
    └── ...
```
