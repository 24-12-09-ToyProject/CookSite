#  :cookie: 쿠킹 정보 & 상품 구매 & 배움을 제공하는 종합 서비스
<img width="827" alt="KakaoTalk_20250210_140306723" src="https://github.com/user-attachments/assets/aa02f350-0709-4700-8255-1de748b41f36" />

## 프로젝트 소개
- 식탁의 비밀은 요리를 좋아하는 사람들이 자신의 레시피를 공유하고, 음식이나 도구를 구매 하며 요리 수업까지 배울 수 있는 올인원 서비스입니다.
(여기부터 각자 기능 간결하게 한줄 작성)

## 팀원 구성

| 엄태운 | 엄은지 | 조홍빈 | 이충무
| :---: | :---: | :---: | :---: |
| 1|<img width="150" alt="KakaoTalk_20250210_144959582" src="https://github.com/user-attachments/assets/5b29b401-96e8-4a56-a198-3daa54fd0524"/>| <img width ="150" alt="2ac4d61cd9b1cedd9c714ade97845366" src ="https://github.com/user-attachments/assets/d0d8b2d8-f08c-40d5-bb5e-fc340b2e6c2f" />| <img width="150" alt="KakaoTalk_20250210_144745939" src="https://github.com/user-attachments/assets/142d2be9-2562-4010-b756-44f67fb1c1a4" />|
| [@Github](https://github.com/TaewoonEom) | [@Github](https://github.com/eomji1233) | [@Github](https://github.com/Puer1111) |[@Github](https://github.com/dudrnrduddj) |

## :bulb: 개발 환경
### - Language
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) <br>
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css&logoColor=white"><br>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=000000"><br>
### - Frontend & Backend
<img src="https://img.shields.io/badge/node-5FA04E?style=for-the-badge&logo=node.js&logoColor=white"><br>
### - API
<img src="https://img.shields.io/badge/kakaoMap-ffcd00.svg?style=for-the-badge&logo=kakaoMap&logoColor=000000"><br>
<img src="https://img.shields.io/badge/Naver-03C75A.svg?style=for-the-badge&logo=Naver&logoColor=000000"> <br>
### - DB
<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=MySQL&logoColor=000000"> <br>
### Cooperation
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)<br>
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white) <br>
<img src="https://img.shields.io/badge/Sourcetree-0052CC.svg?style=for-the-badge&logo=Sourcetree&logoColor=000000"> <br>

## :scroll: 프로젝트 구조 
```
TOYPROJECT/
├── config/             # 공통 설정 파일
├── controllers/        # 기능 컨트롤러 파일
├── dtos/               # DTO 파일
├── node_modules/       # node 모듈 파일
├── repositories/       # 레포지토리 파일
├── routes/             # 각 기능 라우터 파일
├── services/           # 기능 서비스 파일
├── static/             # 렌더링에 필요한 정적 파일
|  ├──css/              # 기능별 CSS파일
|  ├──img/              # 기능별 이미지
|  ├──js/               # 기능별 자바스크립트
├── uploads/            # 페이지 업로드 이미지
├── utils/              # 편의 설정 파일
├── views/              # 기능별 html 파일
├── .gitignore          # Git 무시 파일 목록
├── app.js              # 메인 실행 파일
├── package-lock.json   # 정확한 종속성 버전이 기록된 파일 , 일관된 빌드 보장
├── package.json        # 스크립트 정의 및 프로젝트 종속성 표시
├── README.md           # 프로젝트 개요  
```
## :books: 브랜치 전략
- **main**
  - 배포 가능한 상태의 코드
- **{name}**
  - 기능 단위로 나뉘어 독립적인 개발환경으로 기능 구현
  - 모든 기능은 해당 브랜치에서 이루어집니다.
 
## :tada: 역할 분담
### :wine_glass:엄태운
  - **UI**
    - 페이지 구성 작성
  - **기능**
      - 기능 작성
### :fries:엄은지
  - **UI**
    - 페이지 구성 작성
  - **기능**
      - 기능 작성
### :spaghetti:조홍빈
  - **UI**
    - 페이지 구성 작성
  - **기능**
      - 기능 작성
###  :doughnut:이충무
  - **UI**
    - 페이지 구성 작성
  - **기능**
      - 기능 작성
   
## :date: 개발 기간과 작업관리

### 개발 기간 
  - 2025/01/07 ~ 25/02/10

### 작업 관리
  - 원활한 개발을 위해 공통 스프레드시트를 만들어 주간목표를 설정하고 진행률을 공유했습니다.

## :computer: 페이지별 기능
### [공통]
  - 헤더 기능 작성 
### [레시피]
  - 기능1
  - 기능2
### [스토어]
  - 기능1
  - 기능2
### [쿠킹 클래스]
  - 기능1
  - 기능2
### [회원가입]
  - 기능1
  - 기능2
### [로그인]
  - 기능1
  - 기능2
## :hammer: 개선목표
  - 브랜치 분리
    - 독립성을 위해 1차로 main 과 기능별 branch 로 분류 되어있지만 개발용 main 브랜치와 배포용 main 브랜치를 별개로 설정 후 개발을 마친 뒤 배포용에 commit 하는 구조 생성
  -   

    




