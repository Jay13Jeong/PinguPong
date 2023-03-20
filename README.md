# PINGUPONG 핑구퐁

![pongu](https://user-images.githubusercontent.com/63899204/211287320-c6af6432-82c4-4350-aa59-68b17edbc139.jpg)

## 소개
실시간 대전 핑퐁 웹 게임 프로젝트입니다.

## 기술 스택
<div align=center> 
<img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
</div>

## 구현 기능
- Profil  - 친구 추가/차단, DM, 2차비밀번호 설정/해제, PingPong 전적, 유저상태(오프라인, 온라인, 게임중)</br>
- PingPong - 실시간 매칭, 관전, 난이도 모드, 도전장기능</br>
- Chat   - 기본방, 비밀방, 방장(강퇴, 밴, 음소거설정/해제)</br>

## Installation & Execution
프로젝트는 docker-compose로 구성되어 있습니다.

google api 또는 42api의 클라이언트 아이디와 시크릿키를 준비해야하며, 없다면 각 사이트에서 발급해야 합니다.

프로젝트를 실행시키는 방법은 다음과 같습니다.
1. .env_template 파일을 통해 .env를 설정해줍니다. 설정해야 하는 항목은 다음과 같습니다.
   - POSTGRES_USER : 디비 초기화 유저.
   - POSTGRES_PASSWORD : 디비 초기화 유저 비번.
   - POSTGRES_ROOT_PASSWORD : 디비 초기화 루트 비번.
   - NESTJS_USER : nestjs에서 DB에 접속할 때 사용하는 유저 ID (POSTGRES_USER와 동일해야 함)
   - NESTJS_PASSWORD : nestjs에서 DB에 접속할 때 사용하는 유저 PW (POSTGRES_PASSWORD와 동일해야 함)
   - SERVER_HOST : 서버의 호스트 네임
   - AUTH_CLIENT_ID : 42api 클라이언트 ID.
   - ACCESS_SECRET : 42api 보안 secret key 및 JWT Token을 생성할 때 사용하는 비밀 문자열. (키가 없다면 복잡하게 설정해야 함)
   - AUTH_CALLBACK_URL : 42api 접근 성공시 받을 콜백주소.
   - GOOGLE_AUTH_CLIENT_ID : google api 클라이언트 ID.
   - GOOGLE_ACCESS_SECRET : google api 보안 secret key
   - GOOGLE_AUTH_CALLBACK_URL : google api 접근 성공시 받을 콜백주소.
   - HOST_2FA : 메일 호스트 주소.
   - USER_2FA : 코드전송 시 사용할 나의 메일 주소.
   - PASS_2FA : 코드전송 시 사용할 나의 메일 비번.
   
2. make 합니다.

## Browser Support
이 프로젝트는 크롬과 사파리 브라우저에서 테스트되었습니다.

<img width="1666" alt="Screen Shot 2023-03-10 at 7 09 46 PM" src="https://user-images.githubusercontent.com/63899204/224290392-2b1432c9-6657-4dcf-bf9a-6bb1343ec1cc.png">

<img width="1645" alt="Screen Shot 2023-03-10 at 7 17 37 PM" src="https://user-images.githubusercontent.com/63899204/224290447-1e17136a-702f-4b15-a7f6-1f9199c14967.png">

<img width="1655" alt="Screen Shot 2023-03-10 at 7 10 31 PM" src="https://user-images.githubusercontent.com/63899204/224290483-d28dc8ef-6fad-4eef-9d53-7924b22cd01a.png">

<img width="1660" alt="Screen Shot 2023-03-10 at 7 17 09 PM" src="https://user-images.githubusercontent.com/63899204/224290504-d1b3b4b7-180a-4aa8-8f8a-bcdd0e474c62.png">


## ERD

<img width="1051" alt="Screen Shot 2023-03-20 at 7 23 31 PM" src="https://user-images.githubusercontent.com/67796301/226312792-4579192c-5a3e-49e7-b9c9-42d872fa3017.png">

<img width="958" alt="Screen Shot 2023-03-20 at 7 24 23 PM" src="https://user-images.githubusercontent.com/67796301/226312893-408edf00-4ee2-4036-b2ad-81c99eb6d9f9.png">

<img width="785" alt="Screen Shot 2023-03-20 at 7 23 45 PM" src="https://user-images.githubusercontent.com/67796301/226312923-1d8c801b-6d04-419c-a2df-e8adcb37f30e.png">
