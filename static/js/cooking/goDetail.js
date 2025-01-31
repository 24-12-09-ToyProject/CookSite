// DOM 으로 페이지 렌더링

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");

    cardContainer.addEventListener("click", (event) => {
        const target = event.target.closest("a"); // <a> 태그를 찾음
        if (target && target.dataset.classId) {
            const classNo = target.dataset.classNo; // 클래스 ID 가져오기
            window.location.href = `/class/${classNo}`; // 상세 페이지로 이동
        }
    });
});