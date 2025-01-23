const pool = require('../../config/db.js');



// 회원가입 쿼리 실행
function signUpMember(memberJson){
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
			return resultMessage;
		}

		console.log('database connection completed!');
		resultMessage = "db 연결 성공";

		// db랑 연결되어있는 끈에 쿼리를 보냄
		const exec = conn.query('insert into member_tbl values(?,?,?,?,?,?,?,?,?,?,?, DEFAULT,?,?);', 
			[memberJson.memberId
				, memberJson.memberPw
				, memberJson.memberName
				, memberJson.zonecode || null
				, memberJson.defaultAddress || null
				, memberJson.detailAddress || null
				, memberJson.phone[0] + '-' + memberJson.phone[1] + '-' + memberJson.phone[2]
				, memberJson.email
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

					return resultMessage;
				}

				// result 존재 -> 성공
				if(result){
					console.log(result);
					console.log('insert 성공');

					resultMessage = "insert 성공";

					return resultMessage;
				}else{
					console.log('insert 실패');

					resultMessage = "insert 실패"
					return resultMessage;
				}
			}
		);
	})

}



// 아이디 중복 체크 쿼리문
function checkDuplicateId(memberId, callback){
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
		const exec = conn.query('select count(*) count from member_tbl where member_id = ?', 
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



module.exports = {
		signUpMember
	, checkDuplicateId
};