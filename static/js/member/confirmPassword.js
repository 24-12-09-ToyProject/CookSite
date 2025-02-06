const elMemberPw = document.querySelector('#memberPw');
const confirmForm = document.querySelector('#confirm-form');

	if(confirmPasswordResult !== ""){
		Swal.fire({
			icon: 'warning',
			title: '비밀번호 확인',
			html: `<p>비밀번호를 다시 입력해 주세요.</p>
							<p> 본인 확인을 위해 정확한 비밀번호를 입력해야 합니다.</p>`,
			confirmButtonColor: '#555', // confrim 버튼 색깔 지정				
		}).then((result)=>{
			if(result.isConfirmed){
				// 비밀번호 입력창 포커스
				elMemberPw.focus();
			}
		});
	}else{
		elMemberPw.focus();
	}

	elMemberPw.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirmPassword();
        }
    });

	function confirmPassword(){
		if(elMemberPw.value.trim() === ''){
			alert('비밀번호를 입력해주세요');
			elMemberPw.focus();
			return;
		}else{

			confirmForm.submit();
		}

	}