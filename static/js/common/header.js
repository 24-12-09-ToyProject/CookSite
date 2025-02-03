let myExpandVisible = false;

// 프로필 사진 클릭하면 메뉴 열고 닫기
// 드롭다운 해보려고 로그인 버튼에 이벤트 달아본거니 프로필 사진 넣고 프사에 이벤트 걸어야됨!!
document.querySelector("#header-login").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let expand = document.querySelector(".header-my-expand");
    if(myExpandVisible) {
        expand.style.display = 'none';
    } else {
        expand.style.display = 'block';
    }
    myExpandVisible = !myExpandVisible;
});

// 페이지 내 다른 곳을 클릭하면 메뉴 닫기
document.addEventListener("click", (e) => {
    const expand = document.querySelector(".header-my-expand");
    if (myExpandVisible && !expand.contains(e.target)) {
        expand.style.display = 'none';
        myExpandVisible = false;
    }
});

// 레시피 등록 화면으로 이동하는 이벤트
document.querySelector("#header-write-recipe").addEventListener("click", (e) => {
    e.preventDefault();
    if(confirm('레시피 작성 화면으로 이동합니다.')) {
        window.location.href = '/recipe/register';
    }
});