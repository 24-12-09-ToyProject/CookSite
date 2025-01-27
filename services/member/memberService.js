const pool = require('../../config/db.js');
const { verifyValue, allVerifyValue } = require('../../static/js/member/argon.js');


// 공통 데이터베이스 쿼리 실행 함수
async function queryDatabase(sql, params = []) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message || error);
    throw '데이터베이스 쿼리 실패';
  }
}

// 회원가입
async function signUpMember(memberJson, plainValue) {
  try {
    console.log('/signUp 호출', memberJson);

    // 생년월일 처리
    if (memberJson.dateOfBirth.some(value => value)) {
      const [year = '1900', month = '01', day = '01'] = memberJson.dateOfBirth;
      memberJson.dateOfBirth = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
    } else {
      memberJson.dateOfBirth = null;
    }

    // 비밀번호 중복 체크
    const passwords = await queryDatabase('SELECT `member_pw` AS password FROM members');
    const isDuplicate = await allVerifyValue(passwords, plainValue);
    if (isDuplicate) throw new Error('비밀번호 중복');

    // 회원정보 삽입
    const sql = `
      INSERT INTO members (
        member_id, member_pw, member_name, zone_code, default_address,
        detail_address, phone, email, gender, calendar_type,
        date_of_birth, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT)
    `;
    const params = [
      memberJson.memberId,
      memberJson.memberPw,
      memberJson.memberName,
      memberJson.zonecode || null,
      memberJson.defaultAddress || null,
      memberJson.detailAddress || null,
      memberJson.phone.join('-'),
      `${memberJson.email}${memberJson.emailDomain}`,
      memberJson.gender || null,
      memberJson.calendarType || 'solar',
      memberJson.dateOfBirth || null,
    ];
    await queryDatabase(sql, params);
    console.log('회원가입 성공');
    return '회원가입 성공';
  } catch (error) {
    console.error('회원가입 오류:', error.message || error);
    throw '회원가입 실패';
  }
}

// 아이디 중복 체크
async function checkDuplicateId(memberId) {
  try {
    const result = await queryDatabase(
      'SELECT COUNT(*) AS count FROM members WHERE member_id = ?',
      [memberId]
    );
    return result[0].count > 0 ? '이미 존재하는 아이디' : '사용 가능한 아이디';
  } catch (error) {
    console.error('아이디 중복 체크 오류:', error.message || error);
    throw '아이디 중복 체크 실패';
  }
}

// 로그인
async function checkAccount(memberId, memberPw) {
  try {
    const results = await queryDatabase(
      'SELECT `member_id` AS id, `member_pw` AS password FROM members WHERE member_id = ?',
      [memberId]
    );

    if (results.length === 0) return '존재하지 않는 아이디';

    const isMatch = await verifyValue(results[0].password, memberPw);
    return isMatch ? '존재하는 계정' : '존재하지 않는 계정';
  } catch (error) {
    console.error('로그인 오류:', error.message || error);
    throw '로그인 실패';
  }
}

// 계정 찾기
async function findAccount(memberName, email) {
  try {
    const results = await queryDatabase(
      'SELECT `member_id` AS id FROM members WHERE member_name = ? AND email = ?',
      [memberName, email]
    );

    if (results.length === 0) return { resultMessage: '존재하지 않는 계정', maskedId: '' };

    const maskedId = results[0].id.replace(/(?<=^..).*(?=..$)/g, '******');
    return { resultMessage: '존재하는 계정', maskedId };
  } catch (error) {
    console.error('계정 찾기 오류:', error.message || error);
    throw '계정 찾기 실패';
  }
}

// 이메일 인증번호 저장
async function addEmailCode(email, authNumber) {
  try {
    const sql = 'INSERT INTO email_verifications (email, auth_number) VALUES (?, ?);';
    await queryDatabase(sql, [email, authNumber]);
    return '이메일 인증번호 저장 성공';
  } catch (error) {
    console.error('이메일 인증번호 저장 오류:', error.message || error);
    throw '이메일 인증번호 저장 실패';
  }
}

// 이메일 인증번호 검증
async function verifyEmailCode(email, emailCode) {
  try {
    console.log('verifyEmailCode 호출');

    const sql = `
      SELECT * 
      FROM email_verifications 
      WHERE email = ? 
        AND expiration_time >= NOW() 
        AND created_at <= NOW() 
        AND auth_number = ?  
      ORDER BY id DESC 
      LIMIT 1
    `;
    const params = [email, emailCode];

    // 데이터베이스 조회
    const results = await queryDatabase(sql, params);

    // 결과 검증
    if (results.length > 0) {
      console.log('인증 성공:', results);
      return '인증 성공';
    } else {
      console.log('인증 실패: 조건에 맞는 데이터 없음');
      return '인증 실패';
    }
  } catch (error) {
    console.error('verifyEmailCode 오류:', error.message || error);
    throw '이메일 인증 코드 검증 실패';
  }
}

module.exports = {
  signUpMember,
  checkDuplicateId,
  checkAccount,
  findAccount,
  addEmailCode,
  verifyEmailCode,
};
