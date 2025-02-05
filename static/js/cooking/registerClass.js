document.addEventListener("DOMContentLoaded", () => {
    const createClassLink = document.getElementById("createClass");
    const completedClassLink = document.getElementById("completedClass");
    const createContent = document.getElementById("createContent");
    const contentArea = document.getElementById("contentArea");

    // 요소 검증 (null 체크)
    if (!createClassLink || !completedClassLink || !createContent || !contentArea) {
        console.error("필요한 요소를 찾을 수 없습니다. HTML 구조를 확인하세요.");
        return;
    }

    // Sidebar 클릭 이벤트 공통 함수
    function handleSidebarClick(activeLink, inactiveLink, showContent, hideContent) {
        console.log(`${activeLink.id} 클릭됨`); // 디버깅 로그

        // Sidebar 스타일 업데이트
        activeLink.parentElement.classList.add("active");
        inactiveLink.parentElement.classList.remove("active");

        // 콘텐츠 표시/숨김
        showContent.hidden = false;
        hideContent.hidden = true;
    }

    // "클래스 생성" 클릭 이벤트
    createClassLink.addEventListener("click", () => {
        handleSidebarClick(createClassLink, completedClassLink, createContent, contentArea);
    });

    // "등록 완료 클래스" 클릭 이벤트
    completedClassLink.addEventListener("click", async () => {
        handleSidebarClick(completedClassLink, createClassLink, contentArea, createContent);

        try {
            console.log("API 요청 시작"); // 디버깅 로그
            const response = await fetch("/api/completed-classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("클래스 데이터를 가져오는 데 실패했습니다. 응답 상태: " + response.status);
            }

            const data = await response.json();
            console.log("API 응답 데이터:", data); // 디버깅 로그

            // 콘텐츠 렌더링
            contentArea.innerHTML = ""; // 기존 콘텐츠 초기화
            if (data.classes && data.classes.length > 0) {
                data.classes.forEach((cls) => {
                    // 이미지 경로가 절대 경로인지 확인 후 설정
                    const imageUrl = cls.CLASS_THUMBNAIL_IMG;
                        const thumbnail = `
                        <div style="width: 300px; height: 320px;">
                        <div class="thumbnail" style="position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background-color: #f9f9f9;">
                            <img src="${imageUrl}" alt="${cls.CLASS_TITLE}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <p style="width: 100%; text-align: center; margin: 0; font-style:bold;">${cls.CLASS_TITLE}</p>
                        </div>
                            `;
                    
                    contentArea.innerHTML += thumbnail;
                });
            } else {
                contentArea.innerHTML = `<p>등록된 클래스가 없습니다.</p>`;
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
            contentArea.innerHTML = `<p>클래스 데이터를 가져오는 중 문제가 발생했습니다.</p>`;
        }
    });

    // 초기 상태에서 "클래스 생성" 콘텐츠를 표시
    createClassLink.click();
});
