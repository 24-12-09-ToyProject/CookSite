const express = require('express');
const router = express.Router();

//http:/localhost:8888 / 경로로 접근 시
router.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})

// db 세팅
const pool = require('../../config/db.js');

// 로그인
router.get("/login", (request,response)=>
{
    response.render("Test.html")
}
)
// 로그인 테스트
router.post("/gologin",(req,res)=>
{
    const memberId = req.body.memberId;
    const memberPw = req.body.memberPw;

    res.render("Test2.html",{
        id:memberId,
        pw:memberPw
    });
});

// 쿠킹 클래스 메인 페이지
router.get("/searchClass",(req,res)=>
{
    res.render("searchClass.html")
});

// 클래스 등록 페이지
router.get("/registerClass",(req,res)=>
{
    res.render("registerClass.html")
});

// 클래스 내용 전달
// 실제 데이터는 데이터베이스에서 가져오거나 동적으로 생성
router.get("/api/cooking",(req,res)=>{
    const cardData = [
        {
            img: "../../static/img/cooking/화면 캡처 2025-01-12 135101.png",
            title: "의류패턴제작과 수선",
            category: "핸드메이드",
            price: "260,000원",
            location: "서울",
            link : "#"
        },
        {
            img: "../../static/img/cooking/화면 캡처 2025-01-11 174248-fotor-20250111175520.png",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        ];
        res.json(cardData);
})

//검색 조건
router.post("/api/cooking/filter", async (req, res) => {
    const { classForm, region, classType, category, visitor, weekdays, difficulty, timeMin, timeMax, priceMin, priceMax } = req.body;

    let query = `SELECT CLASS_IMAGE_URL, CLASS_TITLE, CLASS_CATEGORY FROM cooking WHERE 1=1`;
    const params = [];

    if (region) {
        query += ` AND CLASS_LOCATION = ? `;
        params.push(region);
    }

    if (priceMin !== undefined && priceMax !== undefined) {
        query += ` AND CLASS_PRICE BETWEEN ? AND ?`;
        params.push(priceMin, priceMax);
    }

    if (difficulty) {
        query += ` AND CLASS_DIFFICULTY_LEVEL = ?`; // 단일 값 처리
        params.push(difficulty);
    }

    if (visitor) {
        query += ` AND CLASS_PEOPLE_RECRUITED = ?`;
        params.push(visitor);
    }

    if (classType) {
        query += ` AND CLASS_TYPE = ?`;
        params.push(classType);
    }

    if (timeMin && timeMax) {
        query += ` AND CLASS_START_TIME >= ? AND CLASS_END_TIME <= ?`;
        params.push(timeMin, timeMax);
    }

    if (category) {
        query += ` AND CLASS_CATEGORY = ?`;
        params.push(category);
    }

    if (weekdays) {
        query += ` AND CLASS_DATE = ?`; // 단일 값 처리
        params.push(weekdays);
    }

    if (classForm) {
        query += ` AND CLASS_FORM = ?`;
        params.push(classForm);
    }

    console.log("받은 필터:", req.body);
    console.log("실행될 쿼리:", query);
    console.log("바인딩될 파라미터:", params);

    try {
        // 디버깅을 위한 로그
        console.log('Request Body:', req.body);
        console.log('Query:', query);
        console.log('Parameters:', params);

        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute(query, params);
            console.log('Query Results:', results);
            res.json(results || []);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            error: 'Database error',
            message: error.message
        });
    }
});


module.exports = router;