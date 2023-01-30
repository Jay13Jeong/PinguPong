# PINGUPONG 핑구퐁

![pongu](https://user-images.githubusercontent.com/63899204/211287320-c6af6432-82c4-4350-aa59-68b17edbc139.jpg)

## 소개
핑퐁게임 웹 애플리케이션을 만드는 프로젝트입니다.

## Installation & Execution
앱의 프로젝트는 docker-compose로 구성되어 있습니다. 이 프로젝트는 github actions를 통한 배포를 상정하여 구현이 되어 있습니다.

프로젝트를 실행시키는 방법은 다음과 같습니다.
1. .env_template 파일을 통해 .env를 설정해줍니다. `SERVER_HOST=localhost`가 아닌 경우 자동으로 https가 설정됩니다. 설정해야 하는 항목은 다음과 같습니다.
   - MARIADB_USER : MariaDB 유저 ID
   - MARIADB_PASSWORD : MariaDB 유저 PW
   - MARIADB_ROOT_PASSWORD : MariaDB ROOT PW
   - EXPRESS_USER : express에서 MariaDB에 접속할 때 사용하는 유저 ID (MARIADB_USER와 동일해야 함)
   - EXPRESS_USER : express에서 MariaDB에 접속할 때 사용하는 유저 PW (MARIADB_PASSWORD와 동일해야 함)
   - ACCESS_SECRET : express에서 JWT Token을 생성할 때 사용하는 임의의 문자열
   - REFRESH_SECRET : express에서 JWT Refrash Token을 생성할 때 사용하는 임의의 문자열
   - SERVER_HOST : 서버의 호스트 네임 (localhost일 경우 ssl 설정은 하지 않습니다.)
   - MODE : 서버의 배포 모드를 선택합니다. (dev / serve)
2. make 합니다.

## Browser Support
이 프로젝트는 모바일 전용 앱 (관리자 페이지는 PC 전용 앱) 으로 구현되었으며 크롬과 사파리 브라우저에서 테스트되었습니다.

## 폴더 상세 설명

## 관련 문서
* 시나리오 : 
* figma 와이어프레임 (2023.01.04 ~) : 

## Wiki
