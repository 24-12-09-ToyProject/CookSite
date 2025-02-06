const pool = require('../../config/db.js');
const fs = require('fs');
const { verifyValue, allVerifyValue } = require('../../static/js/member/argon.js');
const crypto = require('crypto');

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
      `SELECT 
        m.member_id AS id, 
        m.member_pw AS password,
        i.file_rename
      FROM 
          members m
      LEFT JOIN 
          profile_imgs i ON m.member_id = i.member_id
      WHERE 
          m.member_id = ?;`,
      [memberId]
    );

    if (results.length === 0) return {success:false};

    const isMatch = await verifyValue(results[0].password, memberPw);
    return isMatch ? {success:true, message:"존재하는 계정", info:results[0], } : {success:false, message:"존재하지 않는 계정"};
  } catch (error) {
    console.error('로그인 오류:', error.message || error);
    throw '로그인 실패';
  }
}

// 계정 찾기 - 아이디 찾기
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

// 계정 찾기 - 비밀번호 찾기
async function findPassword(memberId, email) {
  try {
    const results = await queryDatabase(
      'SELECT * FROM members WHERE member_id = ? AND email = ?',
      [memberId, email]
    );

    if (results.length === 0) return { success : false, resultMessage: '존재하지 않는 계정'};

    return { success : true, resultMessage: '존재하는 계정'};
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

// 비밀번호 재설정
async function updatePassword(memberId, memberPw, hashedPw) {
  try {
    // 비밀번호 중복 체크
    const passwords = await queryDatabase('SELECT `member_pw` AS password FROM members');
    const isDuplicate = await allVerifyValue(passwords, memberPw);
    if (isDuplicate) throw new Error('비밀번호 중복');

    const sql = `UPDATE members SET member_pw = ? WHERE member_id = ?;`;
    const params = [hashedPw, memberId];

    // 데이터베이스 조회
    const results = await queryDatabase(sql, params);

    // 결과 검증
    if (results) {
      console.log('비밀번호 재설정 성공:', results);
      return { success : true };
    } else {
      console.log('비밀번호 재설정 실패');
      return '비밀번호 재설정 실패';
    }
  } catch (error) {
    console.error('updatePassword 오류:', error.message || error);
    throw error.message;
  }
}

// 회원 정보 조회
async function selectInfoById(memberId){
  try {
    console.log('selectInfoById 호출');

    const sql = `SELECT * FROM members where member_id = ?;`;
    const params = [ memberId ];

    // 데이터베이스 조회
    const results = await queryDatabase(sql, params);

    // 결과 검증
    if (results.length > 0) {
      console.log('조회 성공:', results[0]);
      return {success:true, info:results[0], message:"회원정보 조회 성공"};
    } else {
      console.log('인증 실패: 조건에 맞는 데이터 없음');
      return '조회 실패';
    }
  } catch (error) {
    console.error('selectInfoById 오류:', error.message || error);
    throw '회원 정보 조회 실패';
  }
}

// 회원정보 수정
async function updateInfo(info){
  try {
    console.log("updateInfo 호출");

    // 값이 존재하는 항목만 필터링
    const filteredInfo = Object.fromEntries(
      Object.entries(info).filter(([_, value]) => value)
    );

    // 객체 키와 DB 컬럼명 매핑
    const columnMap = {
      memberId: "member_id",
      calendarType: "calendar_type",
      defaultAddress: "default_address",
      detailAddress: "detail_address",
      phone: "phone",
      memberName: "member_name",
      zonecode: "zone_code",
      email: "email",
      gender: "gender",
      dateOfBirth: "date_of_birth"
    };

    // `SET` 절 동적 생성
    const setKeys = Object.keys(filteredInfo).filter(key => key !== "memberId");
    const setClause = setKeys.map(key => `${columnMap[key] || key} = ?`).join(", ");

    // `params`를 안전하게 생성
    const params = [...setKeys.map(key => filteredInfo[key]), filteredInfo.memberId];
    let sql = '';
    // SQL 실행
    if (setClause) {
      sql = `UPDATE members SET ${setClause}, updated_at = DEFAULT WHERE member_id = ?`;
      console.log(sql);
      console.log(params);
    }

    // 데이터베이스 조회
    const result = await queryDatabase(sql, params);

    // 결과 검증
    if (result) {
      console.log('수정 성공:');
      return {success:true, message:"회원정보 수정 성공"};
    } else {
      console.log('수정 실패');
      return '수정 실패';
    }
  } catch (error) {
    console.error('updateInfo 오류:', error.message || error);
    throw '회원 정보 수정 실패';
  }
}

// 프로필 추가 ( 기존 사진 있을 경우 update, 없을 경우 insert)
async function addProfile(fileInfo){
    try {
      console.log('addProfile 호출');

      // 현재 프로필 이미지 가져오기
      const getCurrentImageSql = "SELECT file_path, file_rename FROM profile_imgs WHERE member_id = ?";
      const currentImage = await queryDatabase(getCurrentImageSql, [ fileInfo.memberId ]);
      let result;

      if(currentImage.length > 0){

        // 기존 이미지 파일 삭제 (서버에서 실제 파일 제거)
        const oldImagePath = currentImage[0].file_path + currentImage[0].file_rename;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        console.log("update 실행됨");
        
        // 기존 레코드 업데이트
        const updateSql = "UPDATE profile_imgs SET file_rename = ? WHERE member_id = ?";
        result = await queryDatabase(updateSql, [ fileInfo.fileReName, fileInfo.memberId ]);

      }else{
        console.log("insert 실행됨");
        
        // 새로운 프로필 이미지 삽입
        const insertSql = "INSERT INTO profile_imgs (file_name, file_rename, file_path, member_id) VALUES (?, ?, ?, ?)";
        result = await queryDatabase(insertSql, [fileInfo.fileName, fileInfo.fileReName, fileInfo.filePath, fileInfo.memberId]);
      }
  
      // 결과 검증
      if (result) {
        console.log('addProfile 성공');
        return {success:true, message:"프로필 추가 성공"};
      } else {
        console.log('프로필 추가 실패');
        return {success:false, message:"프로필 추가 실패"};
      }
    } catch (error) {
      console.error('addProfile 오류:', error.message || error);
      throw '프로필 추가 실패';
    }

}

// 프로필 제거
async function removeProfile(memberId, currentProfile){
  try {
    console.log('removeProfile 호출');

  // 현재 프로필 이미지 가져오기

    // 기존 이미지 파일 삭제 (서버에서 실제 파일 제거)
    const oldImagePath = `${process.env.FILE_PATH}member/${currentProfile}`
    
    if (fs.existsSync(oldImagePath)) {
      console.log("C드라이브에서도 삭제 성공");
      
      fs.unlinkSync(oldImagePath);
    }
  


    const sql = `DELETE FROM profile_imgs WHERE member_id = ?`;
    const params = [ memberId ];

    // 데이터베이스 조회
    const results = await queryDatabase(sql, params);

    // 결과 검증
    if (results) {
      console.log('삭제 성공');
      return {success:true, message:"프로필 삭제 성공"};
    } else {
      console.log('프로필 삭제 성공');
      return '프로필 삭제 실패';
    }
  } catch (error) {
    console.error('removeProfile 오류:', error.message || error);
    throw '프로필 삭제 실패';
  }
}

// 회원 탈퇴
async function deleteAccount(memberId, currentProfile){
  try {
    console.log('deleteAccount 호출');

    // 기존 이미지 파일 삭제 (서버에서 실제 파일 제거)
    const oldImagePath = `${process.env.FILE_PATH}member/${currentProfile}`
    
    if (fs.existsSync(oldImagePath)) {
      console.log("C드라이브에서도 삭제 성공");
      fs.unlinkSync(oldImagePath);
    }

    const sql = `DELETE FROM members WHERE member_id = ?`;
    const params = [ memberId ];

    // 데이터베이스 조회
    const results = await queryDatabase(sql, params);

    // 결과 검증
    if (results) {
      console.log('삭제 성공');
      return {success:true, message:"회원 정보 삭제 성공"};
    } else {
      console.log('회원 정보 삭제 성공');
      return '회원 정보 삭제 실패';
    }
  } catch (error) {
    console.error('deleteAccount 오류:', error.message || error);
    throw '회원 정보 삭제 실패';
  }

}


// sns 가입 여부 확인
async function findSnsMember(snsMember){
  try {
    console.log('findSnsMember 호출');

    const sql = 'SELECT * FROM social_members s LEFT JOIN members m USING(member_id) WHERE sns_id = ?';
    const params = [ snsMember.id ];

    // 데이터베이스 조회
    const results = await queryDatabase(sql, params);

    // 결과 검증
    if (results.length > 0) {
      console.log('조회 성공:', results[0]);
      return {success:true, info:results[0], message:"회원정보 조회 성공"};
    } else {
      console.log('인증 실패: 조건에 맞는 데이터 없음');
      return '조회 실패';
    }
  } catch (error) {
    console.error('findSnsMember 오류:', error.message || error);
    throw '회원 정보 조회 실패';
  }
  
}

// sns 회원가입
async function snsSignup(snsInfo){  //여기서부터 시작
  let gender;
  if(snsInfo.gender === 'M'){
    gender = 'male';
  }else if(snsInfo.gender === 'F'){
    gender = 'female';
  }

  const dateOfBirth = snsInfo.birthday && snsInfo.birthyear ? `${snsInfo.birthyear}-${snsInfo.birthday}` : null;

  const randomMember = crypto.randomBytes(20).toString('hex');

  try {
    console.log('snsSignup 호출');
    console.log(snsInfo);
    const snsFinalInfo = {
      memberId:randomMember,
      memberName:snsInfo.name,
      phone:snsInfo.mobile,
      email:snsInfo.email,
      gender:gender,
      dateOfBirth:dateOfBirth,
      snsId:snsInfo.id,
      profileImg:snsInfo.profile_image,
      provider:'naver'
    };


    // 회원정보 insert ( 1. members 2. social_members)
    const membersSql = `
      INSERT INTO members (
        member_id, member_pw, member_name, zone_code, default_address,
        detail_address, phone, email, gender, calendar_type,
        date_of_birth, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT)
    `;
    
    const snsSql = `
      INSERT INTO social_members (sns_id, member_id, profile_img, provider) VALUES (?, ?, ?, ?)
    `;

    const memberParams = [
      snsFinalInfo.memberId,
      null, //pw는 null
      snsFinalInfo.memberName || null,
      null,
      null,
      null,
      snsFinalInfo.phone || null,
      snsFinalInfo.email || null,
      snsFinalInfo.gender || null,
      snsFinalInfo.calendarType || 'solar',
      snsFinalInfo.dateOfBirth || null,
    ];

    const snsParams = [
      snsFinalInfo.snsId || null,
      snsFinalInfo.memberId || null,
      snsFinalInfo.profileImg || null,
      snsFinalInfo.provider
    ];

    // members insert
    await queryDatabase(membersSql, memberParams);
    // social_members insert
    await queryDatabase(snsSql, snsParams);
    

    console.log('회원가입 성공');
    return {success:true, message:"회원가입 성공", info:snsFinalInfo};
  } catch (error) {
    console.error('snsSignup 오류:', error.message || error);
    throw '회원가입 실패';
  }
}

module.exports = {
  signUpMember,
  checkDuplicateId,
  checkAccount,
  findAccount,
  addEmailCode,
  verifyEmailCode,
  findPassword,
  updatePassword,
  selectInfoById,
  updateInfo,
  addProfile,
  removeProfile,
  deleteAccount,
  findSnsMember,
  snsSignup
};
