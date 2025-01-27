const { generateClassNo } = require('../../utils/cookingUtils');
// db 세팅
const pool = require('../../config/db.js');
//googleCloud 
const { bucket, bucketName } = require('../../config/googlecloud.js');

//검색 조건
exports.searchClass = async (req, res) => {
    const { classTitle,classForm, region, classType, category, visitor, weekdays, difficulty, timeMin, timeMax, priceMin, priceMax,keyword } = req.body;

    let query = `SELECT CLASS_IMAGE_URL, CLASS_TITLE, CLASS_CATEGORY FROM cooking WHERE 1=1`;
    const params = [];
    if (classTitle) {
        query += ` AND CLASS_TITLE LIKE ? COLLATE utf8_general_ci`;
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

    if (classForm) {
        query += ` AND CLASS_FORM = ?`;
        params.push(classForm);
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

        // GCS에 파일 업로드
        const blob = bucket.file(Date.now() + "_" + req.file.originalname); // 고유한 파일 이름 지정
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on("error", (err) => {
            console.error(err);
            return res.status(500).send("Error uploading to GCS.");
        });

        blobStream.on("finish", async () => {
            // GCS 파일 URL 생성
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            res.status(200).json({ url: publicUrl }); // 업로드된 파일 URL 반환
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
};


// 클래스 생성 컨트롤러
exports.createClass = (req, res) => {
    // classNo 생성
    const classNo = generateClassNo();

    const {
        classType,classFrequency,classTitle,category,classAddress,startTime,endTime,thumbnailURL, classImages,classIntroduce, difficulty,classPlayingTime,curriculum,instructorPhoto, instructorName, instructorintroduce,classCount,classPrice,startDate,endDate,minPeople,maxPeople
    } = req.body;


    // 데이터 삽입 쿼리
    const query = `INSERT INTO COOKING VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    values = [
        classNo,'Test',classType,classFrequency,classTitle,category,classAddress,startTime,endTime,thumbnailURL, classImages,classIntroduce, difficulty,classPlayingTime,curriculum,instructorPhoto, instructorName, instructorintroduce,classCount,classPrice,startDate,endDate,minPeople,maxPeople 
    ];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({ success: true, classNo, data: result });
    });
};
