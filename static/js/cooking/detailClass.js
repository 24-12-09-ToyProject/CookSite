function changeImage(element) {
    const mainImage = document.getElementById("main-image");
    mainImage.src = element.src;
}

function increaseCount() {
    const participants = document.getElementById("participants");
    let count = parseInt(participants.value, 10);
    participants.value = count + 1;
}

function decreaseCount() {
    const participants = document.getElementById("participants");
    let count = parseInt(participants.value, 10);
    if (count > 1) {
        participants.value = count - 1;
    }
}
async function fetchClassDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const classNo = urlParams.get("classNo"); // URL에서 classNo 가져오기

    if (!classNo) {
        alert("클래스 번호가 없습니다.");
        return;
    }

    try {
        const response = await fetch(`class/${classNo}`); // API 호출
        const data = await response.json();

        if (!data.success) {
            alert(data.message || "클래스 정보를 불러올 수 없습니다.");
            return;
        }

        const classData = data.classData;
        console.log("📌 상세 페이지 데이터:", classData);

        // HTML 요소에 데이터 삽입
        document.getElementById("class-title").textContent = classData.CLASS_TITLE;
        document.getElementById("class-category").textContent = classData.CLASS_CATEGORY;
        document.getElementById("class-address").textContent = classData.CLASS_ADDRESS;
        document.getElementById("class-difficulty").textContent = classData.CLASS_DIFFICULTY_LEVEL;
        document.getElementById("class-price").textContent = classData.CLASS_PRICE;
        document.getElementById("class-minpeople").textContent = classData.CLASS_MINPEOPLE;
        document.getElementById("class-maxpeople").textContent = classData.CLASS_MAXPEOPLE;
        
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

    } catch (error) {
        console.error("🚨 클래스 상세 정보 요청 에러:", error);
        alert("클래스 정보를 불러오는 중 오류가 발생했습니다.");
    }
}

// 페이지 로드 시 자동 실행
fetchClassDetail();