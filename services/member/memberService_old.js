const pool = require('../../config/db.js');
const { verifyValue, allVerifyValue } = require('../../static/js/member/argon.js');



// 회원가입 쿼리 실행 - Promise 이용
async function signUpMember(memberJson, plainValue){
	return new Promise((resolve, reject) => {
		console.log("/signUp 호출" + memberJson);

		let resultMessage;

		let dateString = '';

		// 조건 처리
		if (memberJson.dateOfBirth.some(value => value)) {
			// 셋 중 하나라도 값이 있으면 나머지를 default로 채움
			const year = memberJson.dateOfBirth[0] || '1900';
			const month = memberJson.dateOfBirth[1] || '01';
			const day = memberJson.dateOfBirth[2] || '01';
			dateString = `${year}-${month}-${day}`;

			// Date 객체로 변환
			const dateObject = new Date(dateString);
			// MySQL DATE 형식으로 변환 (YYYY-MM-DD)
			const formattedDate = dateObject.toISOString().split('T')[0];
		
			memberJson.dateOfBirth = formattedDate;
		} else {
			// 모두 값이 없으면 빈 문자열
			memberJson.dateOfBirth = '';
		}



		// connection 연결
		pool.getConnection((err, conn)=>{

			// db 연결 실패시 에러
			if(err){
				conn.release();
				console.log('Mysql getConnection error');

				resultMessage = "db 연결 실패";
				return reject(resultMessage);
			}

			console.log('database connection completed!');
			resultMessage = "db 연결 성공";


		// 1. 비밀번호 중복 체크
			conn.query('SELECT `member_pw` password FROM members', (err, results) => {
			if (err) {
				console.log('비밀번호 중복 확인 중 오류 발생');
				resultMessage = "비밀번호 중복 확인 중 오류 발생";
				conn.release();
				return reject(resultMessage);
			}

			// 비밀번호 중복이 있으면
			if (results.length > 0) {

					allVerifyValue(results, plainValue).then(match =>{

						if(match){
							resultMessage = "비밀번호 중복";
							conn.release();
							return reject(resultMessage);
						}

						// 2.  비밀번호 중복 아닐 시 insert문 실행
						const exec = conn.query('insert into members values(?,?,?,?,?,?,?,?,?,?,?, DEFAULT,?,?);', 
							[memberJson.memberId
								, memberJson.memberPw
								, memberJson.memberName
								, memberJson.zonecode || null
								, memberJson.defaultAddress || null
								, memberJson.detailAddress || null
								, memberJson.phone[0] + '-' + memberJson.phone[1] + '-' + memberJson.phone[2]
								, memberJson.email + memberJson.emailDomain
								, memberJson.gender || null
								, memberJson.calenderType || 'solar'
								, memberJson.dateOfBirth || null
								, null
								, null],
				
							(err, result)=>{
								conn.release(); // 다음 차례로 넘겨줌
								console.log('실행된 SQL : ' + exec.sql); // 실제 값으로 치환된 실행 쿼리문 확인이 가능
				
								// SQL 실행 시 발생한 오류
								if(err){
									console.log('SQL 실행시 오류 발생');
									console.dir(err); // 오류 사항 확인
									resultMessage = "SQL 실행 오류 발생";
				
									return reject(resultMessage);
								}
				
								// result 존재 -> 성공
								if(result){
									console.log(result);
									console.log('insert 성공');
				
									resultMessage = "insert 성공";
				
									return resolve(resultMessage);
								}else{
									console.log('insert 실패');
				
									resultMessage = "insert 실패"
									return reject(resultMessage);
								}
							}
						);


					});
					
				
				
			}
			
		});


		})
	})
	

}



// 아이디 중복 체크 쿼리문 - callback 이용
function checkDuplicateId(memberId, callback){

	console.log("checkDuplicateId 실행");
	
	// connection 연결
	pool.getConnection((err, conn)=>{

		// db 연결 실패시 에러
		if(err){
			conn.release();
			console.log('Mysql getConnection error');

			resultMessage = "db 연결 실패";
			callback(resultMessage);
			return;
		}

		console.log('database connection completed!');
		resultMessage = "db 연결 성공";

		// db랑 연결되어있는 끈에 쿼리를 보냄
		const exec = conn.query('select count(*) count from members where member_id = ?', 
			[ memberId ],

			(err, rows)=>{
				conn.release(); // 다음 차례로 넘겨줌
				console.log('실행된 SQL : ' + exec.sql); // 실제 값으로 치환된 실행 쿼리문 확인이 가능

				// SQL 실행 시 발생한 오류
				if(err){
					console.log('SQL 실행시 오류 발생');
					console.dir(err); // 오류 사항 확인
					resultMessage = "SQL 실행 오류 발생";
					callback(resultMessage);
					return;
				}
				console.log("결과 :     " + rows[0].count);
				
				// rows[0] > 0 -> 결과 : 중복 O
				if(rows[0].count > 0){
					console.log("rows[0].count : " + rows[0].count);
					console.log('select 성공');

					resultMessage = "이미 존재하는 아이디";
					callback(resultMessage);
					return;

					// rows = 0 -> 결과 : 중복 X
				}else{
					console.log('rows[0].count : '+ rows[0].count);

					resultMessage = "사용 가능한 아이디"
					callback(resultMessage);
					return;
				}
			}
		);
	})



}


async function checkAccount(memberId, memberPw){
	return new Promise((resolve, reject) => {
		
		// connection 연결
		pool.getConnection((err, conn)=>{
			// db 연결 실패시 에러
			if(err){
				conn.release();
				console.log('Mysql getConnection error');
				resultMessage = "db 연결 실패";
				return reject(resultMessage);
			}
			// db 연결 성공
			console.log('database connection completed!');
			resultMessage = "db 연결 성공";


		// 1. 아이디, 비밀번호 확인
			conn.query('SELECT `member_id` id, `member_pw` password FROM members where member_id = ?' ,[ memberId ] ,(err, results) => {
			if (err) {
				console.log('SQL문 실행중 오류 발생');
				resultMessage = "SQL문 실행중 오류 발생";
				conn.release();
				return reject(resultMessage);
			}

			// result 존재 -> 성공
			if(results.length > 0){
				console.log(results);
				console.log('select 성공');

				verifyValue(results[0].password, memberPw)
				.then(
					(match)=>{
						console.log("then match : " + match)
				
					if(match){
						resultMessage = "존재하는 계정";
						conn.release();
						return resolve(resultMessage);
					}else{
						resultMessage = "존재하지 않는 계정";
						conn.release();
						return resolve(resultMessage);
					}
					});
				

			}else{
				console.log('존재하지 않는 아이디');

				resultMessage = "존재하지 않는 아이디"
				conn.release();
				return resolve(resultMessage);
			}
		});


		})
	});
}


async function findAccount(memberName, email){
	return new Promise((resolve, reject)=>{

		// connection 연결
		pool.getConnection((err, conn)=>{
			// db 연결 실패시 에러
			if(err){
				conn.release();
				console.log('Mysql getConnection error');
				resultMessage = "db 연결 실패";
				return reject(resultMessage);
			}
			// db 연결 성공
			console.log('database connection completed!');
			resultMessage = "db 연결 성공";


			// 1. 이름, 이메일 확인
			conn.query('SELECT `member_id` id, `member_name` name, `email` email FROM members where member_name = ? and email = ?' , [ memberName, email ], (err, results) => {
				if (err) {
					console.log('SQL문 실행중 오류 발생');
					resultMessage = "SQL문 실행중 오류 발생";
					conn.release();
					return reject(resultMessage);
				}

				// result 존재 -> 성공
				if(results.length > 0){
					console.log(results);
					console.log('존재하는 계정');

					resultMessage = "존재하는 계정"
					const maskedId = results[0].id.replace(/(?<=^..).*(?=..$)/g, '******');

					const memberJson = {resultMessage:resultMessage, maskedId:maskedId};
					conn.release();
					return resolve(memberJson);

				}else{
					console.log('존재하지 않는 계정');

					resultMessage = "존재하지 않는 계정"
					const maskedId = "";

					const memberJson = {resultMessage:resultMessage, maskedId:maskedId};

					conn.release();
					return resolve(memberJson);
				}
			});


		})
	});
}

// email 인증번호 db저장
async function addEmailCode(email, auth_number){
	return new Promise((resolve, reject) => {

		// connection 연결
		pool.getConnection((err, conn)=>{
			// db 연결 실패시 에러
			if(err){
				conn.release();
				console.log('Mysql getConnection error');
				resultMessage = "db 연결 실패";
				return reject(resultMessage);
			}
			// db 연결 성공
			console.log('database connection completed!');
			resultMessage = "db 연결 성공";

				conn.query('INSERT INTO email_verifications (email, auth_number) VALUES (?, ?);' , [ email, auth_number ], (err, results) => {
					if (err) {
						console.log('SQL문 실행중 오류 발생');
						resultMessage = "SQL문 실행중 오류 발생";
						conn.release();
						return reject(resultMessage);
					}

					// results 존재 -> 성공
					if(results){
						console.log(results);
						console.log('insert 성공');

						resultMessage = "insert 성공";
						conn.release();
						return resolve(resultMessage);

					}else{
						console.log('insert 성공');

						resultMessage = "insert 성공"

						conn.release();
						return resolve(resultMessage);
					}
				});


			})
		})
}


async function verifyEmailCode(email, emailCode){
	return new Promise((resolve, reject) => {
	// connection 연결
	pool.getConnection((err, conn)=>{
		// db 연결 실패시 에러
		if(err){
			conn.release();
			console.log('Mysql getConnection error');
			resultMessage = "db 연결 실패";
			return reject(resultMessage);
		}
		// db 연결 성공
		console.log('database connection completed!');
		resultMessage = "db 연결 성공";

			conn.query('SELECT * FROM email_verifications WHERE email = ? AND expiration_time >= now() AND created_at <= now() AND auth_number = ?  ORDER BY id DESC LIMIT 1' , [ email , emailCode ], (err, results) => {
				if (err) {
					console.log('SQL문 실행중 오류 발생');
					resultMessage = "SQL문 실행중 오류 발생";
					conn.release();
					return reject(resultMessage);
				}

				// results 존재 -> 성공
				if(results.length > 0){
					console.log(results);
					console.log('select 성공');

					resultMessage = "인증 성공";
					conn.release();
					return resolve(resultMessage);

				}else{
					console.log('select 실패');

					resultMessage = "인증 실패"

					conn.release();
					return resolve(resultMessage);
				}
			});


		})
	})
}



module.exports = {
		signUpMember
	, checkDuplicateId
	, checkAccount
	, findAccount
	, addEmailCode
	, verifyEmailCode
};