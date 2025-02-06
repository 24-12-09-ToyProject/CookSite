const elMemberName = document.querySelector('#memberName');
	const elEmail = document.querySelector('#email');
	const findIdForm = document.querySelector('#find-id');
	
	// 이름 입력창 포커스
	elMemberName.focus();

	// 입력창에서 enter 가능
	document.querySelectorAll('#memberName, #email').forEach(input => {
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            findMemberId();
        }
    });
	});

async	function checkValidInput(){
	let memberName = elMemberName.value;
	let email = elEmail.value;

	// id 필수입력 체크
	if(memberName === ""){
		alert("이름을 입력해주세요");
		elMemberName.focus();
		return;
	}
	
	// email 필수입력 체크
	if(email === ""){
		alert("이메일을 입력해주세요");
		elEmail.focus();
		return;
	}

	

	// 서버 검증 -> id, email 확인 후 존재하면 이메일 전송
	const response = await fetch('/member/api/find-id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ memberName, email })
	});

	const result = await response.json();

	console.log("find-id : " + result.success + result.maskedId);

	if (result.success) {
		Swal.fire({
			title: '아이디 찾기 성공!',
			html: '<p>회원님의 아이디는 <strong style="color:#333;">' + result.maskedId + '</strong> 입니다.</p>'
					+ '<p>비밀번호를 잊으셨다면 <a href="/member/findPassword" style="color:#d33;">비밀번호 찾기</a>를 진행해주세요.</p>',
			icon: 'success',
			confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
		});
	} else {
		Swal.fire({
				icon: 'warning',
				title: '아이디 찾기 실패',
				text: '입력하신 정보와 일치하는 계정이 없습니다.',
				confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
		});
	}
}


function findMemberId(){
	checkValidInput();
}
