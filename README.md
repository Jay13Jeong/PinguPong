# PINGUPONG 핑구퐁

![pongu](https://user-images.githubusercontent.com/63899204/211287320-c6af6432-82c4-4350-aa59-68b17edbc139.jpg)

## 소개
실시간 대전 핑퐁 웹 게임 프로젝트입니다.

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

