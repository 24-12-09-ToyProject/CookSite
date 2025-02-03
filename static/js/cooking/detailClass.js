// async function fetchClassDetail() {
//     const pathParts = window.location.pathname.split("/");
//     const classNo = pathParts[pathParts.length - 1]; // 마지막 경로가 classNo
//     // const urlParams = new URLSearchParams(window.location.search); // 이 방식은 쿼리스트링 
//     // const classNo = urlParams.get("classNo"); // URL에서 classNo 가져오기

//     if (!classNo) {
//         alert("클래스 번호가 없습니다.");
//         return;
//     }

//     try {
//         const response = await fetch(`/api/class/${classNo}`); // API 호출
//         const data = await response.json();

//         if (!data.success) {
//             alert(data.message || "클래스 정보를 불러올 수 없습니다.");
//             return;
//         }

//         const classData = data.classData;
//         classPrice = parseInt(classData.CLASS_PRICE, 10) || 0;
//         console.log("📌 상세 페이지 데이터:", classData);

//         // HTML 요소에 데이터 삽입
//         document.getElementById("class-title").textContent = classData.CLASS_TITLE;
//         document.getElementById("class-category").textContent = classData.CLASS_CATEGORY;
//         document.getElementById("class-address").textContent = classData.CLASS_ADDRESS;
//         document.getElementById("class-difficulty").textContent = classData.CLASS_DIFFICULTY_LEVEL;
//         document.getElementById("class-price").textContent = classPrice;
//         document.getElementById("class-minpeople").textContent = classData.CLASS_MINPEOPLE;
//         document.getElementById("class-maxpeople").textContent = classData.CLASS_MAXPEOPLE;
//         document.getElementById("class-playingtime").textContent=classData.CLASS_PLAYING_TIME + "시간";
//         document.querySelector(".introduce-content").textContent=classData.CLASS_INTRODUCE;
//         document.querySelector(".curriculum-content").textContent=classData.CLASS_CURRICULUM;
//         document.querySelector(".instructor-content").textContent=classData.CLASS_INSTRUCTOR_INTRODUCE;
//         // 썸네일 이미지 삽입
//         document.getElementById("class-thumbnail").src = classData.CLASS_THUMBNAIL_IMG;

//         // 상세 이미지 리스트 삽입
//         const imagesContainer = document.getElementById("class-images");
//         imagesContainer.innerHTML = ""; // 기존 내용 제거
//         if (classData.CLASS_CONTENT_IMG.length > 0) {
//             classData.CLASS_CONTENT_IMG.forEach(img => {
//                 const imgElement = document.createElement("img");
//                 imgElement.src = img;
//                 imgElement.alt = "상세 이미지";
//                 imgElement.width = 200;
//                 imagesContainer.appendChild(imgElement);
//             });
//         } else {
//             imagesContainer.innerHTML = "<p>상세 이미지가 없습니다.</p>";
//         }

//     } catch (error) {
//         console.error("🚨 클래스 상세 정보 요청 에러:", error);
//         alert("클래스 정보를 불러오는 중 오류가 발생했습니다.");
//     }
// }

fetchClassDetail().then(classData => {
    if (!classData) return;

    // HTML 요소에 데이터 삽입
    document.getElementById("class-title").textContent = classData.CLASS_TITLE;
    document.getElementById("class-category").textContent = classData.CLASS_CATEGORY;
    document.getElementById("class-address").textContent = classData.CLASS_ADDRESS;
    document.getElementById("class-difficulty").textContent = classData.CLASS_DIFFICULTY_LEVEL;
    document.getElementById("class-price").textContent = classPrice;
    document.getElementById("class-minpeople").textContent = classData.CLASS_MINPEOPLE;
    document.getElementById("class-maxpeople").textContent = classData.CLASS_MAXPEOPLE;
    document.getElementById("class-playingtime").textContent = classData.CLASS_PLAYING_TIME + "시간";
    document.querySelector(".introduce-content").textContent = classData.CLASS_INTRODUCE;
    document.querySelector(".curriculum-content").textContent = classData.CLASS_CURRICULUM;
    document.querySelector(".instructor-content").textContent = classData.CLASS_INSTRUCTOR_INTRODUCE;

    // 썸네일 이미지 삽입
    document.getElementById("class-thumbnail").src = classData.CLASS_THUMBNAIL_IMG;

    // 상세 이미지 리스트 삽입
    const imagesContainer = document.getElementById("class-images");
    imagesContainer.innerHTML = ""; // 기존 내용 제거
    if (classData.CLASS_CONTENT_IMG.length > 0) {
        classData.CLASS_CONTENT_IMG.forEach(img => {
            const imgElement = document.createElement("img");
            imgElement.src = img;
            imgElement.alt = "상세 이미지";
            imgElement.width = 200;
            imagesContainer.appendChild(imgElement);
        });
    } else {
        imagesContainer.innerHTML = "<p>상세 이미지가 없습니다.</p>";
    }
});

// 페이지 로드 시 자동 실행
fetchClassDetail();


//  멀티탭 바 관련
function ClickTabs(button) {
    // 1. 모든 버튼에서 'active' 클래스 제거
    const tabs = document.querySelectorAll(".class-MultiTabs");
    tabs.forEach((tab) => tab.classList.remove("active"));

    // 2. 클릭된 버튼에 'active' 클래스 추가
    button.classList.add("active");

    // 3. 모든 콘텐츠 숨기기
    const contents = document.querySelectorAll(".content-item");
    contents.forEach((content) => {
        content.style.display = "none"; // 완전히 숨김
        content.setAttribute("hidden", "true");
    });

    // 4. 클릭된 탭과 연결된 콘텐츠 표시
    const targetContentId = `content-${button.value.replace("class-", "")}`; // "class-" 제거하여 매칭
    const targetContent = document.getElementById(targetContentId);
    if (targetContent) {
        targetContent.style.display = "block"; // 보이게 함
        targetContent.removeAttribute("hidden");
    } else {
        console.error(`🚨 오류: '${targetContentId}' ID를 가진 콘텐츠가 없음`);
    }

    // 5. 언더바 이동 (선택 사항)
    const indicator = document.querySelector(".Multitabs-indicator");
    const tabRect = button.getBoundingClientRect();
    const scrollerRect = button.parentNode.getBoundingClientRect();
    indicator.style.width = `${tabRect.width}px`;
    indicator.style.transform = `translateX(${tabRect.left - scrollerRect.left}px)`;
}

// ✅ **초기화: 첫 번째 탭 활성화 및 기본 콘텐츠 표시**
document.addEventListener("DOMContentLoaded", () => {
    const firstTab = document.querySelector(".class-MultiTabs");
    if (firstTab) {
        firstTab.classList.add("active"); // 첫 번째 탭 활성화
        const firstContentId = `content-${firstTab.value.replace("class-", "")}`;
        const firstContent = document.getElementById(firstContentId);
        if (firstContent) {
            firstContent.style.display = "block"; // 첫 번째 콘텐츠 표시
            firstContent.removeAttribute("hidden");
        }
    }
});

// 달력
document.addEventListener("DOMContentLoaded", () => {
    const calendarButton = document.getElementById("calendar-button");
    const calendarPopup = document.getElementById("calendar-popup");
    const calendarBody = document.getElementById("calendar-body");
    const currentMonth = document.getElementById("current-month");

    // 초기 날짜
    let selectedDate = new Date(2025, 1, 4); // 2025년 2월 4일
    let currentViewDate = new Date(selectedDate);

    // 달력 토글
    calendarButton.addEventListener("click", (event) => {
        event.stopPropagation(); // 내부 요소 클릭해도 이벤트 실행되게 함
        calendarPopup.hidden = !calendarPopup.hidden; // 숨기기/보이기 토글
    });

    // 달력 렌더링
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        currentMonth.textContent = `${year}년 ${month + 1}월`;

        // 해당 달의 첫 번째 날과 마지막 날
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // 달력 초기화
        calendarBody.innerHTML = "";

        // 첫 번째 날의 요일 계산
        const startDay = firstDayOfMonth.getDay();

        // 날짜 그리기
        let row = document.createElement("tr");
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement("td");
            row.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const cell = document.createElement("td");
            cell.textContent = day;

            // 날짜 클릭 이벤트
            cell.addEventListener("click", () => {
                selectedDate = new Date(year, month, day);
                document.getElementById("selected-date").textContent = formatDate(selectedDate);
                calendarPopup.hidden = true; // 달력 숨기기
            });

            row.appendChild(cell);

            // 주(week)가 끝날 때 새로운 행(row) 추가
            if ((startDay + day) % 7 === 0) {
                calendarBody.appendChild(row);
                row = document.createElement("tr");
            }
        }
        // 마지막 줄 추가
        if (row.children.length > 0) {
            calendarBody.appendChild(row);
        }
    }
    // 달력 바깥 클릭 시 닫기
    window.addEventListener("click", (event) => {
    if (!calendarPopup.hidden && !calendarPopup.contains(event.target) && event.target !== calendarButton) {
    calendarPopup.hidden = true;
    }
    });

    // 이전 달 보기
    document.getElementById("prev-month").addEventListener("click", () => {
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        renderCalendar(currentViewDate);
    });

    // 다음 달 보기
    document.getElementById("next-month").addEventListener("click", () => {
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        renderCalendar(currentViewDate);
    });

    // 날짜 포맷 (YYYY.MM.DD.)
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}.`;
    }

    // 초기 렌더링
    renderCalendar(currentViewDate);
});
// let classPrice = 0;
function PlusMinus(button) {
    const plusMinusChecking = button.value; // 버튼 value 확인 (plus 또는 minus)
    const showPersonCount = document.querySelector(".showPersonCount"); // 인원수 표시 요소
    const classPriceElement = document.getElementById("class-price"); // 총 가격 표시 요소

    let currentCount = parseInt(showPersonCount.textContent, 10); // 현재 표시된 인원수 가져오기
    const pricePerPerson = parseInt(classPrice, 10); // 전역 classPrice를 숫자로 변환

    // 인원수 증가/감소
    if (plusMinusChecking === "minus") {
        if (currentCount > 0) {
            currentCount -= 1;
        }
    } else if (plusMinusChecking === "plus") {
        currentCount += 1;
    }

    // 인원수와 총 가격 계산
    const totalPrice = currentCount * pricePerPerson;

    // DOM 업데이트
    showPersonCount.textContent = currentCount; // 인원수 업데이트
    classPriceElement.textContent = totalPrice; // 총 가격 업데이트
}

// 페이지 로드 시 classPrice와 상세 정보를 가져옴
document.addEventListener("DOMContentLoaded", () => {
    fetchClassDetail();
});