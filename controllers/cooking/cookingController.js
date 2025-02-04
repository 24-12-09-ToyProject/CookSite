const { generateClassNo } = require('../../utils/cookingUtils');
// db 세팅
const pool = require('../../config/db.js');
//googleCloud 
const { bucket } = require('../../config/googlecloud.js');

//검색 조건
exports.searchClass = async (req, res) => {
    const { classTitle, region, classType, classFrequency, category, visitor, weekdays, difficulty, timeMin, timeMax, priceMin, priceMax,keyword } = req.body;

    let query = `SELECT CLASS_NO , CLASS_THUMBNAIL_IMG, CLASS_TITLE, CLASS_CATEGORY , CLASS_INSTRUCTOR_IMG,CLASS_INSTRUCTOR_NICKNAME FROM cooking WHERE 1=1`;
    const params = [];
    if (classTitle) {
        query += ` AND CLASS_TITLE LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`%${classTitle.trim()}%`);
    }

    if (region) {
        query += ` AND CLASS_ADDRESS LIKE ?`;
        params.push(`%${region}%`);
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
        query += ` AND CLASS_MINPEOPLE >= ?`;
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

    if (classFrequency) {
        query += ` AND CLASS_FREQUENCY LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`$${classFrequency}%`);
    }
    if(keyword) {
        query += ` AND CLASS_CATEGORY =?`;
        params.push(keyword);
    }

    console.log("받은 필터:", req.body);
    console.log("실행될 쿼리:", query);
    console.log("바인딩될 파라미터:", params);

    try {
        // 디버깅을 위한 로그
        console.log('Request Body:', req.body);
        console.log('Query:', query);
        console.log('Parameters:', params);

        const connection =  await pool.getConnection();
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
};

// 파일 업로드 핸들러 함수
exports.uploadFileToGCS = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const blob = bucket.file(Date.now() + "_" + req.file.originalname);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on("error", (err) => {
            console.error("GCS 업로드 실패:", err);
            res.status(500).send("Error uploading to GCS.");
        });

        blobStream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            res.status(200).json({ url: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error("서버 오류:", error);
        res.status(500).send("Server error.");
    }
};


// 클래스 생성 컨트롤러
exports.createClass = async (req, res) => {
    const {
        classImages, // 이미지 배열
        classType, classFrequency, classTitle, category, classAddress,
        startTime, endTime, thumbnailURL, classIntroduce, difficulty,
        classPlayingTime, curriculum, instructorPhoto, instructorName, instructorintroduce,
        startDate, endDate,
    } = req.body;

    console.log("📌 요청된 데이터(req.body):", req.body); // 디버깅용

    // 유효성 검사
    if (!classImages || !Array.isArray(classImages)) {
        return res.status(400).json({ success: false, error: "클래스 이미지가 유효하지 않습니다." });
    }

    // 로그인한 유저 ID 가져오기
    const userId = req.session?.user?.id;  
    if (!userId) {
        return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }


    const classCount = parseInt(req.body.classCount, 10) || 0;
    const classPrice = parseFloat(req.body.classPrice) || 0;
    const minPeople = parseInt(req.body.minPeople, 10) || 0;
    const maxPeople = parseInt(req.body.maxPeople, 10) || 0;

    const classNo = generateClassNo(); // 고유 ID 생성
    console.log("생성된 classNo:", classNo);

    const safeValues = [
        classNo, userId,
        classType || "미정", classFrequency || "미정",
        classTitle || "제목 없음", category || "기타", classAddress || "위치 없음",
        startTime || "00:00", endTime || "00:00",
        thumbnailURL || "https://default-image.png",
        JSON.stringify(classImages || []), // JSON 형태로 저장
        classIntroduce || "소개 없음", difficulty || "미정",
        classPlayingTime || "0", curriculum || "없음",
        instructorPhoto || "https://default-instructor.png", instructorName || "강사 미정",
        instructorintroduce || "소개 없음",
        classCount, classPrice, startDate || "2025-01-01", endDate || "2025-01-01",
        minPeople, maxPeople
    ];

    console.log("📌 DB에 저장할 데이터:", safeValues); // 디버깅용

    const query = `INSERT INTO COOKING VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    try {
        const connection = await pool.getConnection();
        await connection.execute(query, safeValues);
        await connection.execute("COMMIT");
        connection.release();

        res.status(200).json({
            success: true,
            classNo,
            message: "클래스가 성공적으로 생성되었습니다!",
        });
    } catch (err) {
        console.error("🚨 SQL 에러:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};



// 예외 처리 및 미처리된 Promise 예외 핸들링
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

// 상세페이지 
exports.getClassDetail = async (req, res) => { 
    const classNo = req.params.classNo;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `SELECT * FROM COOKING WHERE CLASS_NO = ?`,
            [classNo]
        );
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "클래스를 찾을 수 없습니다." });
        }

        let classData = rows[0];

        // JSON 데이터 변환 (CLASS_CONTENT_IMG이 JSON 문자열일 경우 파싱)
        if (classData.CLASS_CONTENT_IMG) {
            try {
                classData.CLASS_CONTENT_IMG = JSON.parse(classData.CLASS_CONTENT_IMG);
            } catch (error) {
                console.error("🚨 CLASS_CONTENT_IMG JSON 파싱 오류:", error);
                classData.CLASS_CONTENT_IMG = [];
            }
        } else {
            classData.CLASS_CONTENT_IMG = [];
        }

        console.log("📌 상세 페이지 데이터:", classData);
        res.json({ success: true, classData }); // ✅ JSON으로 반환
    } catch (error) {
        console.error("🚨 클래스 상세 조회 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
};

// 등록 페이지에서 본인이 만든 클래스 조회
exports.selectClassInfo =  async (req,res) =>{
    const userId = req.session?.user?.id;
    console.log("id 확인" , userId);
    const query = `SELECT CLASS_THUMBNAIL_IMG , CLASS_TITLE FROM COOKING WHERE CLASS_MEMBER_ID = ?`
    try {
        // 쿼리 실행 (파라미터 바인딩)
        const [rows] = await pool.execute(query, [userId]);

        res.status(200).json({ classes: rows }); // 결과 반환
    } catch (error) {
        console.error("DB 조회 오류:", error);
        res.status(500).json({ error: "데이터를 가져오는 중 오류가 발생했습니다." });
    }
}

