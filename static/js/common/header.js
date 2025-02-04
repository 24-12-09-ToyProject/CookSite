let myExpandVisible = false;

// 로그인 페이지 이동
const loggedOutDiv = document.querySelector('#logged-out-div');
if(loggedOutDiv){
    loggedOutDiv.addEventListener('click', ()=>{
        location.href = '/member/login';
    })
}


// 프로필 사진 클릭하면 메뉴 열고 닫기
const profileDropdownContainer = document.querySelector("#profile-dropdown-container");
if(profileDropdownContainer){
    profileDropdownContainer.addEventListener("click", (e) => {
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
}


// 페이지 내 다른 곳을 클릭하면 메뉴 닫기
document.addEventListener("click", (e) => {
    const expand = document.querySelector(".header-my-expand");
    if (myExpandVisible && !expand.contains(e.target)) {
        expand.style.display = 'none';
        myExpandVisible = false;
    }
});

// 레시피 등록 화면으로 이동
document.querySelector("#header-write-recipe").addEventListener("click", (e) => {
    e.preventDefault();
    if(confirm('레시피 작성 화면으로 이동합니다.')) {
        window.location.href = '/recipe/register';
    }
});

// 나의 레시피로 이동
function goToMyRecipe() {
    window.location.href = '/recipe/myList';
}