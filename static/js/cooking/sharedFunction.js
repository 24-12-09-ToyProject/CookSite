// API 데이터를 저장할 전역 변수
let classData = null;
let classNo = null;
let classPrice = 0;

// API 요청 함수 (한 번만 실행)
async function fetchClassDetail() {
    if (classData) {
        return classData; // 기존 데이터를 반환 (중복 요청 방지)
    }

    const pathParts = window.location.pathname.split("/");
    classNo = pathParts[pathParts.length - 1]; // URL에서 classNo 가져오기

    if (!classNo) {
        alert("클래스 번호가 없습니다.");
        return null;
    }

    try {
        const response = await fetch(`/api/class/${classNo}`); // API 호출
        const data = await response.json();

        if (!data.success) {
            alert(data.message || "클래스 정보를 불러올 수 없습니다.");
            return null;
        }

        classData = data.classData;
        classPrice = parseInt(classData.CLASS_PRICE, 10) || 0;
        console.log("📌 클래스 상세 데이터:", classData);
        return classData;
    } catch (error) {
        console.error("🚨 클래스 상세 정보 요청 에러:", error);
        alert("클래스 정보를 불러오는 중 오류가 발생했습니다.");
        return null;
    }
}

// 전역 객체로 설정하여 다른 JS에서 접근 가능하도록 함
window.fetchClassDetail = fetchClassDetail;
window.classData = classData;
window.classPrice = classPrice;

// 클래스와 멤버 정보 조회
async function fetchClassAndMember(classNo) {
    if (!classNo) {
        console.error("🚨 classNo가 정의되지 않았습니다.");
        return null;
    }

    try {
        const response = await fetch("/api/classMember", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classNo }),
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error("🚨 클래스랑 멤버 상세 정보 요청 에러:", error);
        alert("정보를 불러오는 중 오류가 발생했습니다.");
        return null;
    }
}

// ✅ 전역에서 사용 가능하도록 window 객체에 등록 (다른 JS 파일에서 사용 가능)
window.fetchClassAndMember = fetchClassAndMember;
