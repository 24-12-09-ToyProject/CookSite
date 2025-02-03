const { generateClassNo, getTodayDate } = require("../../../utils/cookingUtils");
// db 세팅
const pool = require("../../../config/db.js");
// 아임포트 세팅
const axios = require("axios"); // 외부 API 요청을 위해 axios 사용
// node 모듈 경로 사용
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../config/cooking/.env") });


exports.requestClassMemberInfo = async (req, res) => {
    const classNo = req.body.classNo; // URL에서 클래스 번호 가져오기

    if (!classNo) {
        return res.status(400).json({ success: false, error: "클래스 번호가 필요합니다." });
    }

    const query = `
        SELECT *
        FROM COOKING C 
        JOIN MEMBERS M ON C.CLASS_MEMBER_ID = M.member_id 
        WHERE C.CLASS_NO = ?
    `;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(query, [classNo]); // ✅ 클래스 데이터 조회
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "해당 클래스를 찾을 수 없습니다." });
        }
        const classData = rows[0];
        res.status(200).json({
            success: true,
            classNo,
            classData,
            message: "클래스 멤버 정보 조회 완료",
        });
    } catch (err) {
        console.error("🚨 SQL 에러:", err);
        res.status(500).json({ success: false, error: "서버 내부 오류 발생" });
    }
};

// 결제 시 토큰 얻기
const getAccessToken = async () => {
    try {
        const { data } = await axios.post("https://api.iamport.kr/users/getToken", {
            imp_key: process.env.IMP_KEY,
            imp_secret: process.env.IMP_SECRET,
        });
        return data.response.access_token;
    } catch (error) {
        console.error("🚨 아임포트 토큰 발급 실패:", error);
        return null;
    }
}

exports.payClass = async (req, res) => {
    const { imp_uid } = req.body;
    // ✅ 요청에서 imp_uid가 없는 경우
    if (!imp_uid) {
        return res.status(400).json({ success: false, error: "imp_uid가 필요합니다." });
    }

    try {
        // ✅ 결제가 정상적으로 처리되었음을 응답
        console.log("✅ 결제 요청 성공. imp_uid:", imp_uid);

        // ✅ 기본 응답 반환
        res.json({
            success: true,
            message: "결제가 완료되었습니다.",
            imp_uid, // ✅ imp_uid를 클라이언트에 반환
        });
    } catch (error) {
        // ✅ 예외 처리
        console.error("🚨 결제 요청 실패:", error.message);
        res.status(500).json({ success: false, error: "서버 내부 오류" });
    }
};


//  결제 검증
exports.validatePayment = async (req,res) => {
    const { imp_uid } = req.body;
    console.log("✅ 조회할 imp_uid:", imp_uid); // 1️⃣ imp_uid 로그 확인
    const reservationNo = generateClassNo();
    const reservationDate = getTodayDate();
 
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("🚨 아임포트 액세스 토큰이 없습니다.");
        return null;
    }
    console.log("✅ 발급된 액세스 토큰:", accessToken); // 2️⃣ 토큰 값 확인

    try {
        const url = `https://api.iamport.kr/payments/${imp_uid}`;
        console.log("✅ 아임포트 API 요청 URL:", url); // 3️⃣ 요청할 URL 확인

        const { data } = await axios.get(url, {
            headers: { Authorization: accessToken },
        });

        console.log("✅ 아임포트 응답 데이터:", data); // 4️⃣ API 응답 확인

        if (data.code === 0) {
            console.log("✅ 결제 정보 조회 성공:", data.response);
            return res.status(200).json({
                success:true,
                data:{
                    reservationNo,
                    reservationDate,
                    ...data.response,
                },
            });
        } else {
            console.error("🚨 결제 정보 조회 실패:", data.message);
            return null;
        }
    } catch (error) {
        console.error("🚨 결제 정보 조회 에러:", error.response?.data || error.message);
        return null;
    }
};
// 결제 저장
exports.savePaymentInfo = async (req, res) => {
    const { buyerInfo, reserveInfo } = req.body;

    // ✅ 데이터가 존재하는지 확인
    if (!buyerInfo || !reserveInfo) {
        console.error("🚨 buyerInfo 또는 reserveInfo가 존재하지 않습니다.");
        return res.status(400).json({ success: false, error: "데이터가 올바르지 않습니다." });
    }

    // ✅ 요청된 데이터 확인
    console.log("✅ buyerInfo:", JSON.stringify(buyerInfo, null, 2));
    console.log("✅ reserveInfo:", JSON.stringify(reserveInfo, null, 2));

    // ✅ SQL 쿼리 정의
    const paymentQuery = `INSERT INTO COOKINGPAYMENT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const reservationQuery = `INSERT INTO COOKINGRESERVATION VALUES (?, ?, ?, ?, ?, ?)`;

    let connection;

    try {
        // ✅ 트랜잭션 시작
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // ✅ undefined 값이 들어가지 않도록 safeValue 설정
        const safeValue = (value, defaultValue = "N/A") => (value !== undefined && value !== null && value !== "" ? value : defaultValue);

        // ✅ 결제 정보 삽입
        await connection.execute(paymentQuery, [
            safeValue(buyerInfo.imp_uid),
            safeValue(buyerInfo.reservationNo),
            safeValue(buyerInfo.CLASS_TITLE),
            safeValue(buyerInfo.pay_method),
            safeValue(buyerInfo.merchant_uid),
            safeValue(buyerInfo.amount, 0), // 금액 기본값 0
            safeValue(buyerInfo.buyer_email),
            safeValue(buyerInfo.buyer_tel),
            safeValue(buyerInfo.MEMBER_ID),
        ]);

        // ✅ 예약 정보 삽입
        await connection.execute(reservationQuery, [
            safeValue(reserveInfo.reservationNo),
            safeValue(reserveInfo.reservationVisitor, 1), // 방문자 수 기본값 1
            safeValue(reserveInfo.imp_uid),
            safeValue(reserveInfo.reservationDate, new Date().toISOString().split("T")[0]), // 기본값: 오늘 날짜
            safeValue(reserveInfo.MEMBER_ID),
            safeValue(reserveInfo.CLASS_TITLE),
        ]);

        // ✅ 커밋
        await connection.commit();
        console.log("✅ 결제 및 예약 정보가 성공적으로 저장되었습니다.");
        res.status(200).json({ success: true, message: "결제 및 예약 정보 저장 완료" });

    } catch (error) {
        console.error("🚨 데이터 삽입 중 오류 발생:", error.message);

        // ✅ 롤백
        if (connection) await connection.rollback();

        res.status(500).json({ success: false, error: "데이터 삽입 중 오류가 발생했습니다." });
    } finally {
        // ✅ 커넥션 해제
        if (connection) connection.release();
    }
};
