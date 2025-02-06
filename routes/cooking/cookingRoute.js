const express = require('express');
const app = express();
const router = express.Router();

//nunjucks 세팅
const path = require('path');
const fs = require('fs');
//google-Cloud 불러오기
const gc = require('../../config/googlecloud.js');


//http:/localhost:8888 / 경로로 접근 시
router.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})

// db 세팅
const pool = require('../../config/db.js');

//컨트롤러 호출
const cookingController = require('../../controllers/cooking/cookingController.js');
const payController = require('../../controllers/cooking/pay/payController.js');
router.post('/api/cooking/filter',cookingController.searchClass);
router.post('/api/cooking/insert',cookingController.createClass);
// multer 설정 가져오기
const { upload } = require('../../config/googlecloud.js');
router.post('/upload',upload.single('image'), cookingController.uploadFileToGCS);

// 로그인 마이페이지 불러오기
const { checkLogin } = require('../member/checkLogin.js');
router.get('/mypage', checkLogin, (req, res)=>{
	res.render('mypage.html');
});

// 쿠킹 클래스 메인 페이지
router.get("/cooking/search",(req,res)=>
{
    res.render("searchClass.html")
});

// 클래스 등록 페이지
router.get("/cooking/register",(req,res)=>
{
    res.render("registerClass.html")
});
// 클래스 등록 추가 페이지
router.get("/cooking/create",(req,res)=>
{
    res.render("createClass.html")
});
// 클래스 메인 페이지
router.post("/api/cooking/class", cookingController.showAllClass);
// ✅ 클래스 상세 페이지 조회 라우터 추가
router.get("/api/class/:classNo", cookingController.getClassDetail);  // ✅ API URL을 명확히 구분

// ✅ 클래스 상세 페이지 (HTML 파일 반환)
router.get("/class/:classNo", (req, res) => {
    res.sendFile(path.join(__dirname, "../../views/cooking/detailClass.html"));
});
//클래스 상세페이지에서 클래스 등록확인 위한 아이디체크
router.post("/api/completed-classes",cookingController.selectClassInfo);
// 결제 준비
router.post("/api/classMember",payController.requestClassMemberInfo);
// 결제 요청
router.post("/payments/pay",payController.payClass);
// 결제 정보 검증 요청 
router.post("/validation/:imp_uid",payController.validatePayment);
// 결제 후 저장
router.post("/payments/save",payController.savePaymentInfo);
// 예약번호 조회
router.post("/api/getImpUid",payController.ImpuidFromReservationNo);
// 결제 취소
router.post("/api/payments/cancel",payController.cancelPayment);
// 예약 정보 조회
router.post("/api/select/reservationInfo",cookingController.showReservationInfo);

// 상세 페이지 조회 위한 설정
app.set("views", path.join(__dirname, "views"));
// 실제 데이터는 데이터베이스에서 가져오거나 동적으로 생성
// router.get("/api/cooking",(req,res)=>{
//     let query = ` `
//     const cardData = [
//         {
//             img: "../../static/img/cooking/화면 캡처 2025-01-12 135101.png",
//             title: "의류패턴제작과 수선",
//             category: "핸드메이드",
//             price: "260,000원",
//             location: "서울",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/화면 캡처 2025-01-11 174248-fotor-20250111175520.png",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         {
//             img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
//             title: "드라이플라워 디퓨저 무드등",
//             category: "플라워·가드닝",
//             price: "55,000원",
//             link : "#"
//         },
//         ];
//         res.json(cardData);
// })


module.exports = router;