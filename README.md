# 쿠킹 정보 & 상품 구매 & 배움을 제공하는 종합 서비스
<img width="800" alt="image" src="https://github.com/user-attachments/assets/3977cf8e-6e9c-4020-98a3-8ff528a3eb01" />

## 프로젝트 소개
- 식탁의 비밀은 요리를 좋아하는 사람들이 자신의 레시피를 공유하고, 음식이나 도구를 구매 하며 요리 수업까지 배울 수 있는 올인원 서비스입니다.

## 팀원 구성

| 엄태운 | 엄은지 | 조홍빈 | 이충무
| :---: | :---: | :---: | :---: |
|<img width="150" alt="KakaoTalk_20250210_160840652" src="https://github.com/user-attachments/assets/71e4d9f0-6c2a-4dc2-bd3f-15189c8ed35c"/>|<img width="150" alt="KakaoTalk_20250210_144959582" src="https://github.com/user-attachments/assets/5b29b401-96e8-4a56-a198-3daa54fd0524"/>| <img width ="150" alt="2ac4d61cd9b1cedd9c714ade97845366" src ="https://github.com/user-attachments/assets/d0d8b2d8-f08c-40d5-bb5e-fc340b2e6c2f" />| <img width="150" alt="KakaoTalk_20250210_144745939" src="https://github.com/user-attachments/assets/142d2be9-2562-4010-b756-44f67fb1c1a4" />|
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
    - 페이지 : 레시피 리스트 페이지 & 상세 정보 페이지 & 레시피 등록, 수정 페이지 & 본인이 등록한 레시피 페이지
  - **기능**
    - 레시피 웹사이트 데이터 크롤링, 레시피 리스트 조회(카테고리별 필터링) 및 상세 정보 조회, 레시피 등록, 수정, 삭제
### :fries:엄은지
  - **UI**
    - 페이지 : 스토어 리스트 페이지 & 상세 정보 페이지 & 장바구니 페이지 & 결제 페이지 & 주문내역 페이지
  - **기능**
    - 상품 등록, 수정, 삭제, 조회(카테고리별 필터링) 및 상세 정보 조회, 장바구니, 결제
### :spaghetti:조홍빈
  - **UI**
    - 페이지: 클래스 검색 페이지 & 등록 및 본인 등록클래스 확인 & 클래스 생성 페이지 
  - **기능**
      - 검색필터를 통한 클래스 검색 , 클래스 등록 내용 확인 및 새 클래스 생성
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
  #### [레시피 리스트]
  - 레시피 웹사이트에서 크롤링하여 DB에 데이터를 저장하였습니다.
  - 상단의 카테고리 선택 버튼을 통해 일치하는 레시피를 조회할 수 있습니다.
  - 레시피는 20개씩 페이징 처리되어 더보기 버튼을 통해 추가적인 확인이 가능합니다.
  - 썸네일 이미지를 클릭하여 레시피 상세 정보 페이지로 이동할 수 있습니다.

  ![레시피 리스트 화면](https://github.com/user-attachments/assets/3a439686-1982-4a3a-9b66-1456e4cc2c9c)
  #### [레시피 등록]
  - 단일 레시피에 대한 정보 및 첨부파일(썸네일, 조리순서 이미지)을 입력할 수 있습니다.
  - 조리 순서는 최대 30단계까지 작성할 수 있으며, 각 단계를 자유롭게 추가 또는 삭제할 수 있습니다.
  - 입력한 재료는 추후 상세 페이지에서 이름과 용량으로 구분되어 표시됩니다.

  ![레시피 등록 화면](https://github.com/user-attachments/assets/b5bf490a-24c3-4a62-9e26-c481b9b80bda)
  #### [레시피 수정]
  - 기존 등록된 정보가 불러와지며, 레시피를 수정 후 저장할 수 있습니다.

  ![레시피 수정 화면](https://github.com/user-attachments/assets/897607de-a380-4956-8e15-6b70605bcb2d)
  #### [작성한 레시피]
  - 회원은 본인이 등록한 레시피를 카테고리 별로 확인할 수 있습니다.
  - 수정과 삭제 버튼으로 레시피를 수정 또는 삭제할 수 있습니다.

  ![내가 작성한 레시피 화면](https://github.com/user-attachments/assets/e0bb4796-eab2-45d4-b6c0-f533bbab790a)
### [스토어]
  #### [스토어 리스트]
  - 사용자는 상단 카테고리별로 상품을 조회할 수 있습니다.
  - 상품을 클릭하면 상세 페이지로 이동합니다.
  - 옵션 선택 후 구매 버튼을 클릭하면 로그인 필요 알림이 표시됩니다.
  ![스토어1 최종](https://github.com/user-attachments/assets/a16ac763-ec4c-468f-a2ca-d5acd751c0e9)

  #### [장바구니]
  - 옵션 선택 시 수량에 따라 가격이 실시간으로 변동되며, 상품을 장바구니에 추가할 수 있습니다.
  - 장바구니 페이지에서는 담긴 상품 목록이 출력됩니다.
  - 장바구니에서 상품 수량을 수정할 수 있고, 7만원 이상 주문 시 배송비가 부과되지 않습니다.
  ![스토어2 최종](https://github.com/user-attachments/assets/2441ef02-3982-4e50-9350-07848587aafc)

  #### [결제]
  - 결제페이지에서 최종적으로 주문하는 상품이 출력됩니다.
  - 배송정보를 입력해야 결제가 가능합니다.
  - 결제는 체크/신용카드/간편결제 모두 가능합니다.
  ![스토어 3최종](https://github.com/user-attachments/assets/c4bf0693-d9d1-43bb-9518-9287c4acaab0)

  #### [구매내역]
  - 결제에 성공하면 자동으로 구매내역 페이지로 이동됩니다.
  - 결제성공 여부와 주문한 상품, 금액이 출력됩니다.
  ![스토어 4최종](https://github.com/user-attachments/assets/4c810055-ff4b-4f7a-926d-0ad8771f217c)

### [쿠킹 클래스]
  #### [클래스 검색]
  - 상단에 검색 조건들을 통해서 등록된 클래스들을 검색 할 수 있습니다.
  - 일부 조건만을 사용해 검색이 가능합니다.
  - 추천 검색어를 통해 빠른 검색이 가능합니다.
    
  ![검색 조건으로 검색하기](https://github.com/user-attachments/assets/f37b720b-b6ac-4987-ae6c-13d29fad3908)
  ![추천 검색어 사용](https://github.com/user-attachments/assets/0c0f23ea-0d91-4f81-9c33-54aae9cd846d)
  #### [클래스 등록]
  - 클래스를 생성하는 페이지로 이동 할 수 있습니다.
  - 로그인 아이디에 따라 등록한 클래스 목록을 확인할 수 있습니다

  ![클래스 등록1](https://github.com/user-attachments/assets/b3da6492-1972-4cf2-b745-5cf8b0c96aa7)
  ![클래스 등록2](https://github.com/user-attachments/assets/27f6bd54-2fb8-4fa9-bda8-fc1780ca9257)
  ![클래스 조회](https://github.com/user-attachments/assets/f970be96-d548-49c1-92c2-93bb54757abf)

  #### [클래스 상세페이지]
  - 해당 클래스를 배우기 위한 결제를 진행 할 수 있습니다.
  
  ![상세페이지 옵션 및 결제](https://github.com/user-attachments/assets/9d70b1f0-beac-4b18-8c44-23134676a2a8)

### [회원 관리]
#### [회원 가입]
  - 가입 시 필수체크란은 반드시 입력이 필요합니다.
  - 조건에 맞는 아이디, 비밀번호 설정이 필요합니다.
  - 아이디 설정 시 중복확인이 필요합니다.
  - 가입할 이메일로 전송된 인증코드를 통해 인증이 필요합니다.
  -  가입 성공/실패 시 로그인 페이지로 이동하여 성공 유무를 확인 가능합니다.

![식탁의비밀 - 회원가입](https://github.com/user-attachments/assets/a9ae1166-c263-4abf-8bd8-d00c62013633)

#### [로그인]
  - 사이트 이용 시 일반, 소셜 로그인을 이용할 수 있습니다.
  - 기존에 일반회원으로 등록된 동일 이메일 계정이 있는 경우 해당 이메일의 소셜 계정을 이용할 수 없습니다.
  - 최초 소셜 로그인 성공시 자동으로 가입 후 로그인됩니다.
##### 일반회원
![식탁의 비밀 - 일반로그인](https://github.com/user-attachments/assets/99d45b32-1f93-4fb0-ac0b-88f7a9f7a20f)
##### 소셜회원
![식탁의 비밀 - 소셜로그인](https://github.com/user-attachments/assets/22566e94-ad71-4443-82b4-7fed33be2180)

#### [계정 찾기]
  - 가입한 이름과 이메일을 확인하여 아이디의 앞·뒤 2자리를 제공합니다.
  - 가입한 아이디와 이메일을 확인한 후 해당 이메일로 비밀번호 재설정 링크가 전송됩니다.
  - 비밀번호 재설정 시 기존의 비밀번호는 사용할 수 없습니다.

![식탁의 비밀 - 계정찾기](https://github.com/user-attachments/assets/5b9d2c95-0937-40e7-97b8-8b3201c6b52d)

#### [회원정보 수정 및 탈퇴]
##### 정보 수정
  - 회원 정보 페이지에서 정보를 수정할 수 있습니다.
  - 프로필을 업로드하거나 제거할 수 있습니다.
  - 이메일 수정 시 재인증이 필요합니다.
  - 소셜 회원의 경우 프로필 이미지, 아이디, 비밀번호, 이메일을 수정할 수 없습니다.
##### 회원 탈퇴
  - 하단의 탈퇴 버튼을 클릭하여 탈퇴할 수 있습니다.
  - 일반 회원은 본인 확인 페이지에서 비밀번호를 입력한 후 탈퇴가 가능합니다.
  - 소셜 회원은 탈퇴 재확인 알림창에서 확인 버튼을 누르면 즉시 탈퇴됩니다.
##### 일반회원
![식탁의비밀 - 일반회원 정보 수정 및 탈퇴](https://github.com/user-attachments/assets/57d10183-4054-425a-9c5c-90b909cd244e)
##### 소셜회원
![식탁의비밀 - 소셜회원 정보수정 및 탈퇴](https://github.com/user-attachments/assets/911a66f0-cd8b-474c-a91c-3a6f8b6dd4b6)


## :hammer: 개선목표
  - 브랜치 분리
    - 독립성을 위해 1차로 main 과 기능별 branch 로 분류 되어있지만 개발용 main 브랜치와 배포용 main 브랜치를 별개로 설정 후 개발을 마친 뒤 배포용에 commit 하는 구조 생성
  - 코드 베이스 작게 유지
    - 중복되는 코드에 의한 반복되는 요청 제거
    - 사용하지 않는 코드 및 기능 제거
    - 서로 분리된 하위 프로젝트로 구성
  - 규칙 생성
    - 개인이 아닌 팀 프로젝트로써 확인하기 쉽게 규칙 생성
  

    




