const argon2 = require('argon2');

// 비밀번호를 해싱하는 함수
async function hashValue(value) {
	try {
			// 비밀번호 해싱
			// 사용할 argon의 타입, 메모리 사용량, 걸리는 시간, 작업 반복 횟수 를 설정
			const hash = await argon2.hash(value, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 });
			console.log('해시 처리할 값:', value);
			console.log('해시 처리된 값:', hash);
			return hash;
	} catch (err) {
			// 해싱 과정에서 오류가 발생한 경우
			console.error('해시 처리 오류:', err);
			throw err;
	}
}

// 비밀번호를 검증하는 함수
async function verifyValue(hash, plainvalue) {
	try {
			// 입력된 비밀번호가 해시된 비밀번호와 일치하는지 검증
			let match = await argon2.verify(hash, plainvalue);
			
			if (match) {
					//일치하는 경우
					console.log('검증 결과: 일치함');
			} else {
					//일치하지 않는 경우
					console.log('검증 결과: 일치하지 않음');
			}
			console.log("match : " + match);
			
			return match;
	} catch (err) {
			// 검증 과정에서 오류가 발생한 경우
			console.error('검증과정에서 오류 발생:', err);
			throw err;
	}
}

// 전체 계정에 대해 검증
async function allVerifyValue(results, plainvalue){
	try {
		let match = false;

		for(let i = 0; i < results.length; i++){
			// 입력된 비밀번호가 해시된 비밀번호와 일치하는지 검증
			// 소셜회원은 db에 null이기 때문에 임의의 데이터 넣어줌
			let password = results[i].password || '$argon2id$v=19$m=65536,t=2,p=1$invalidhash$invalidsalt';
			match = await argon2.verify(password, plainvalue);
			
			if (match) {
					//일치하는 경우
					console.log('검증 결과: 일치함');
					return match;
			} else {
					//일치하지 않는 경우
					console.log('검증 결과: 일치하지 않음');
			}
			console.log("all match : " + match);
		}
		return match;
} catch (err) {
		// 검증 과정에서 오류가 발생한 경우
		console.error('검증과정에서 오류 발생:', err);
		throw err;
}
}

module.exports = { hashValue, verifyValue, allVerifyValue };