const { generateClassNo } = require('../../utils/cookingUtils');
// db 세팅
const pool = require('../../config/db.js');
//googleCloud 
const { bucket } = require('../../config/googlecloud.js');

//검색 조건
exports.searchClass = async (req, res) => {
    const { classTitle, region, classType, classFrequency, category, visitor, weekdays, difficulty, timeMin, timeMax, priceMin, priceMax,keyword } = req.body;

    let query = `SELECT CLASS_THUMBNAIL_IMG, CLASS_TITLE, CLASS_CATEGORY FROM cooking WHERE 1=1`;
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

    // 데이터 삽입 쿼리
    const query = `INSERT INTO COOKING VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [
        classNo, 'Test', classType, classFrequency, classTitle, category, classAddress, 
        startTime, endTime, thumbnailURL, JSON.stringify(classImages), classIntroduce, difficulty, 
        classPlayingTime, curriculum, instructorPhoto, instructorName, instructorintroduce, 
        classCount, classPrice, startDate, endDate, minPeople, maxPeople
    ]; 

    let connection;
    try {
        connection = await pool.getConnection(); // DB 연결
        await connection.execute(query, values); // SQL 실행
        connection.release(); // DB 연결 해제

        console.log("쿼리 실행 완료:", { classNo, values });
        
        // ✅ 성공 응답 전송
        res.status(200).json({
            success: true,
            classNo,
            message: "클래스가 성공적으로 생성되었습니다!"
        });

    } catch (err) {
        console.error("SQL 에러 발생:", err);
        
        if (connection) connection.release(); // 에러 발생 시 DB 연결 해제

        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
};

// 예외 처리 및 미처리된 Promise 예외 핸들링
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});