

let timer; // 타이머 변수
	

function startTimer() {
	let timeLeft = 60; // 1분 카운트
	let time = `01:00`;
	// 타이머가 이미 실행 중이라면 종료
	if (timer) {
		clearInterval(timer);
	}
	document.querySelector("#timer").textContent = time;

	// 타이머 실행
	timer = setInterval(function() {
		timeLeft--; // 남은 시간 감소
		// 남은 시간이 0초가 되면 타이머 종료
		if (timeLeft <= 0) {
			clearInterval(timer);
			time = `00:00`;
			document.querySelector("#timer").textContent = time;
		} else {
			// 타이머 업데이트
			if(timeLeft < 10){
				time = `00:0${timeLeft}`;
			}else{
				time = `00:${timeLeft}`;
			}
			document.querySelector("#timer").textContent = time;
		}
	}, 1000); // 1초마다 실행
}