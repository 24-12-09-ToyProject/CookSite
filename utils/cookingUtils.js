// 랜덤 문자열 + 숫자로 classNo 생성
function generateClassNo() {
    const length = 10;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// 날짜 생성
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 1월 = 0이므로 +1 필요
    const day = String(today.getDate()).padStart(2, '0'); // 날짜가 한 자리일 경우 앞에 0 추가

    return `${year}-${month}-${day}`; // YYYY-MM-DD 형식 반환
}
module.exports = {
    generateClassNo,
    getTodayDate
};