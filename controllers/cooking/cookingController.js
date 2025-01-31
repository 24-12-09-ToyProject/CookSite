const { generateClassNo } = require('../../utils/cookingUtils');
// db 세팅
const pool = require('../../config/db.js');
//googleCloud 
const { bucket } = require('../../config/googlecloud.js');

//검색 조건
exports.searchClass = async (req, res) => {
    const { classTitle, region, classType, classFrequency, category, visitor, weekdays, difficulty, timeMin, timeMax, priceMin, priceMax,keyword } = req.body;

    let query = `SELECT CLASS_NO , CLASS_THUMBNAIL_IMG, CLASS_TITLE, CLASS_CATEGORY FROM cooking WHERE 1=1`;
    const params = [];
    if (classTitle) {
        query += ` AND CLASS_TITLE LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`%${classTitle.trim()}%`);
    }

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
        classType, classFrequency, classTitle, category, classAddress, startTime, endTime,
        thumbnailURL, classImages, classIntroduce, difficulty, classPlayingTime, curriculum,
        instructorPhoto, instructorName, instructorintroduce,
        startDate, endDate,
    } = req.body;

    const classCount = parseInt(req.body.classCount, 10) || 0;
    const classPrice = parseFloat(req.body.classPrice) || 0;
    const minPeople = parseInt(req.body.minPeople, 10) || 0;
    const maxPeople = parseInt(req.body.maxPeople, 10) || 0;

    // classNo 생성
    const classNo = generateClassNo();
    console.log("생성된 classNo:", classNo);

    const safeValues = [
        classNo, 'Test', 
        classType || "미정", classFrequency || "미정", 
        classTitle || "제목 없음", category || "기타", classAddress || "위치 없음",
        startTime || "00:00", endTime || "00:00", 
        thumbnailURL || "https://default-image.png", JSON.stringify(classImages || []), 
        classIntroduce || "소개 없음", difficulty || "미정",
        classPlayingTime || "0", curriculum || "없음", 
        instructorPhoto || "https://default-instructor.png", instructorName || "강사 미정", 
        instructorintroduce || "소개 없음", 
        classCount, classPrice, startDate || "2025-01-01", endDate || "2025-01-01",
        minPeople, maxPeople
    ];

    const query = `INSERT INTO COOKING VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const selectQuery = `SELECT CLASS_NO FROM COOKING WHERE CLASS_NO = ?`;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.execute(query, safeValues);
        await connection.execute("COMMIT");
        const [rows] = await connection.execute(selectQuery, [classNo]);

        if (rows.length === 0) {
            console.error("🚨 INSERT 후 classNo 조회 실패!");
            return res.status(500).json({ success: false, error: "클래스 번호 조회 실패" });
        }

        console.log("✅ 응답 데이터:", rows[0]);

        res.status(200).json({
            success: true,
            classNo: rows[0].CLASS_NO, // 정확히 DB 컬럼명 사용
            message: "클래스가 성공적으로 생성되었습니다!",
        });
    } catch (err) {
        console.error("SQL 에러 발생:", err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (connection) connection.release();
    }
};


// 예외 처리 및 미처리된 Promise 예외 핸들링
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});




// 컨트롤러 코드
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
            return res.status(404).send("클래스를 찾을 수 없습니다.");
        }

        const classData = rows[0];
        
        // // 인코딩된 URL
        // classData.CLASS_THUMBNAIL_IMG = encodeURI(classData.CLASS_THUMBNAIL_IMG);
        // classData.CLASS_INSTRUCTOR_IMG = encodeURI(classData.CLASS_INSTRUCTOR_IMG);
        // classData.CLASS_CONTENT_IMG = JSON.parse(classData.CLASS_CONTENT_IMG).map((img) => encodeURI(img));
        // 데이터베이스에서 가져온 URL을 그대로 사용
        classData.CLASS_THUMBNAIL_IMG = classData.CLASS_THUMBNAIL_IMG;
        classData.CLASS_INSTRUCTOR_IMG = classData.CLASS_INSTRUCTOR_IMG;
        classData.CLASS_CONTENT_IMG = JSON.parse(classData.CLASS_CONTENT_IMG);
        console.log("📌 인코딩된 상세 페이지 데이터:", classData);

        res.render("detailClass.html", { classData });
    } catch (error) {
        console.error("🚨 클래스 상세 조회 오류:", error);
        res.status(500).send("서버 오류 발생");
    }
};

