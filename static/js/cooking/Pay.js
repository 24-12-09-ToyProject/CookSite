
// 전역 변수 선언
let classMemberData = null;

// ✅ HTML이 로드된 후 실행
document.addEventListener("DOMContentLoaded", async function () {

    // ✅ A.js에서 정의한 fetchClassAndMember가 존재하는지 확인 후 실행
    if (typeof fetchClassAndMember === "function") {
        try {
            const data = await fetchClassAndMember(classNo);

            if (data && data.classData) {
                classMemberData = data.classData; // ✅ 첫 번째 멤버 데이터 저장
                console.log("✅ 결제 데이터:", classMemberData);
            } else {
                console.error("🚨 데이터가 없습니다.");
                alert("클래스 정보를 불러오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("🚨 데이터 로드 중 오류 발생:", error);
        }
    } else {
        console.error("🚨 fetchClassAndMember 함수가 정의되지 않았습니다. A.js가 먼저 로드되었는지 확인하세요.");
    }
});
let reservationVisitor = 1;
document.querySelectorAll(".calc").forEach(button => {
    button.addEventListener("click", () => {
    reservationVisitor = parseInt(document.querySelector(".showPersonCount").innerText, 10);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    if (window.IMP) {
        console.log("✅ 아임포트 로드 완료");
        window.IMP.init("imp68486865");
    } else {
        console.error("🚨 아임포트 로드 실패: window.IMP가 정의되지 않음");
    }
});
async function requestPay() {
    if (!classMemberData) {
        alert("결제 데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
    }

    const totalAmount = classMemberData.CLASS_PRICE * reservationVisitor;

    IMP.request_pay(
        {
            pg: "html5_inicis.INIpayTest", // KG이니시스
            pay_method: "card",
            merchant_uid: "merchant_" + new Date().getTime(),
            name: classMemberData.CLASS_TITLE,
            amount: totalAmount,
            // amount: 100,
            buyer_email: classMemberData.email,
            buyer_name: classMemberData.member_id,
            buyer_tel: classMemberData.phone,
        },
        async function (rsp) {
            if (rsp.success) {
                console.log("✅ 결제 성공, imp_uid:", rsp.imp_uid);

                try {
                    // ✅ 결제 정보 서버에 전달 (payClass API 호출)
                    const payResponse = await fetch("/payments/pay", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                            amount: rsp.paid_amount,
                        }),
                    });

                    const payResult = await payResponse.json();

                    if (payResult.success) {
                        console.log("✅ 서버 결제 요청 성공:", payResult);
                        alert("결제가 완료 되었습니다 \n예약 번호는 마이페이지에서 확인 가능합니다.");
                        // 결제 검증 요청
                        const validationResponse = await fetch(`/validation/${rsp.imp_uid}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                imp_uid: rsp.imp_uid,
                                merchant_uid:rsp.merchant_uid,
                            }),
                        });

                        const validationResult = await validationResponse.json();

                        if (!validationResult.success) {
                            console.error("🚨 결제 검증 실패:", validationResult.error);
                            alert(`결제 검증 실패: ${validationResult.error}`);
                            return;
                        }

                        if (validationResult.success) {
                            console.log("결제검증이 완료되었습니다!");
                            const selectedDateElement = document.getElementById("selected-date");
                            const selectedDate = selectedDateElement ? selectedDateElement.innerText : null;                            // ✅ 결제 정보 저장 요청
                            const buyerInfo = {
                                imp_uid: rsp.imp_uid,
                                reservationNo: validationResult.data.reservationNo,
                                CLASS_TITLE: classMemberData.CLASS_TITLE,
                                pay_method: "card",
                                merchant_uid: rsp.merchant_uid,
                                amount: parseInt(rsp.paid_amount, 10),
                                buyer_email: rsp.buyer_email,
                                buyer_tel: rsp.buyer_tel,
                                MEMBER_ID: rsp.buyer_name,
                            };

                            const reserveInfo = {
                                reservationNo: validationResult.data.reservationNo,
                                reservationVisitor: reservationVisitor,
                                imp_uid: rsp.imp_uid,
                                reservationDate: validationResult.data.reservationDate,
                                MEMBER_ID: rsp.buyer_name,
                                CLASS_TITLE: classMemberData.CLASS_TITLE,
                                selectedDate,
                            };
                            console.log("✅ 최종 저장할 buyerInfo:", buyerInfo);
                            console.log("✅ 최종 저장할 reserveInfo:", reserveInfo);
                            console.log("✅ JSON 변환 후 데이터:", JSON.stringify({ buyerInfo, reserveInfo }));

                            const saveResponse = await fetch("/payments/save", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ buyerInfo, reserveInfo }),
                            });

                            const saveResult = await saveResponse.json();
                            if (saveResult.success) {
                                console.log("저장이 완료 되었습니다");
                                location.href = "/";
                            } else {
                                console.error("🚨 결제 정보 저장 실패:", saveResult.error);
                                alert(`결제 정보 저장 실패: ${saveResult.error}`);
                            }
                        } else {
                            console.error("🚨 결제 검증 실패:", validationResult.error);
                            alert(`결제 검증 실패: ${validationResult.error}`);
                        }
                    } else {
                        console.error("🚨 결제 요청 실패:", payResult.error);
                        alert(`결제 요청 실패: ${payResult.error}`);
                    }
                } catch (error) {
                    console.error("🚨 결제 처리 중 오류 발생:", error.message);
                    alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
                }
            } else {
                console.error("🚨 결제 실패:", rsp.error_msg);
                alert(`결제가 실패했습니다: ${rsp.error_msg}`);
            }
        }
    );
}

document.querySelector(".apply-button").addEventListener("click", async function () {
    const userId = sessionStorage.getItem("userid"); // 세션에서 아이디 가져오기

    // if (!userId) {
    //     alert("로그인이 필요합니다.");
    //     window.location.href = "/member/login"; // 로그인 페이지로 이동
    //     return;
    // }
    requestPay();
});

async function cancelPay() {
    const reservationNo = prompt("예약 번호를 입력해주세요").trim();
    if (!reservationNo) {
        alert("올바른 예약 번호를 입력해야 합니다.");
        return;
    }

    try {
        // 서버에서 imp_uid를 가져옴.
        const response = await fetch("/api/getImpUid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ reservationNo }) // JSON 형식으로 데이터 전송
        });

        if (!response.ok) {
            throw new Error("예약 정보를 가져오는데 실패했습니다.");
        }

        const imp_uid = await response.json();
        console.log("잘 왔니??" , imp_uid);
        if (imp_uid) {
            const isConfirmed = confirm("정말 취소 하시겠습니까?");
            if (isConfirmed) {
                // 결제 취소 요청 (POST 요청)
                const cancelResponse = await fetch("/api/payments/cancel", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        imp_uid: imp_uid,
                        reason: "고객 요청으로 취소" // 취소 사유 추가
                    })
                });
            if (!cancelResponse.ok) {
                throw new Error("결제 취소에 실패했습니다.");
            }

                alert("취소가 완료되었습니다!");
                console.log(await cancelResponse.json());
            }
        } else {
            alert("유효한 예약 번호가 아닙니다.");
        }
    } catch (error) {
        alert(error.message);
    }
}
document.querySelector(".cancel-button").addEventListener("click", async function () {
    cancelPay();
});
