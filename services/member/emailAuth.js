const {createNewTransport} = require('../../config/member/email'); //위에서만든거 가져옴email.js
const { addEmailCode } = require('../../services/member/memberService.js');


//인증번호를 위한 랜덤숫자만들어주는 함수
const generateRandom = function (min, max) {
    var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
}


const mailAuth = { //객체에 함수를 담음.
    SendMailCode : async (req, res)=>{ // 라우터에서 호출하는 함수. SendMail
        const number = generateRandom(111111,999999); //number변수에 랜덤숫자 생성

        const email = `${req.body.email}${req.body.emailDomain}`;  //사용자가 입력한 이메일을 가져옴.


        const mailOptions = {  //메일 옵션설정을 해주어야된다. 
            from : `${process.env.EMAIL_USER}@naver.com`, //누가보내는 것인가.. 이건 자신의 연결한 메일주소를 입력하면된다.
            to : email,  //사용자가 입력한 이메일 즉 도착할 주소
            subject : '인증코드 발급 관련 메일입니다.', //메일의 제목  
            //메일의 내용
            html : '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + `<h3>${number}</h3>` //text를 전달할려면 key값을 html을 text로 바꿔주면된다. 
        }

        // 인증번호 service
        const result = await addEmailCode(email, number);
        console.log("addEmailCode result : " + result);

        
        if(result === '이메일 인증번호 저장 성공'){
            // 새로운 smtpTransport 연결을 생성
            const smtpTransport = createNewTransport();

            smtpTransport.sendMail(mailOptions , (err , response)=>{ //emil.js에서 가져온 smtpTransport의 sendMail함수를 실행
                console.log(mailOptions);
                
                console.log("response : " + response) //info를 출력해보자. 
                //첫번째 인자로는 mailOptions이 들어가야된다. 위에서 메일의 옵션은 만들었다. 다음인자로는 콜백함수.
                if(err){ //에러시
                    res.json({success : false , message : '메일전송에 실패하였습니다'})
                    smtpTransport.close() //전송종료
                    console.log(err);
                    
                    return;
                }else{ //에러가 아닐시 
                    res.json({success : true , message : '메일전송하였습니다' , authNumber : number});
                    smtpTransport.close() //전송종료
                    return;
                }
            })
        }else{
            res.json({success:false, message:'인증번호 insert 실패'})
        }
        
    },


    SendMailLink : async (req, res, resetLink)=>{ // 라우터에서 호출하는 함수. SendMailLink

        const email = `${req.body.email}`;  //사용자가 입력한 이메일을 가져옴.

        const mailOptions = {  //메일 옵션설정
            from : `${process.env.EMAIL_USER}@naver.com`, // 보내는 사람
            to : email,  // 도착 주소(회원 이메일)
            subject : '비밀번호 재설정 링크입니다', //메일의 제목  
            html : '<h1>비밀번호 재설정 링크 \n\n\n\n\n\n</h1>' + `<h3>${resetLink}</h3>` //메일의 내용
        }

        // 새로운 smtpTransport 연결을 생성
        const smtpTransport = createNewTransport();

        await smtpTransport.sendMail(mailOptions, (err, response) => {
            console.log(mailOptions);

            console.log("response : " + response); //info 출력

            //첫 번째 인자 : mailOptions, 두 번쨰 인자 : 콜백함수
            if (err) { //에러시
                res.json({ success: false, message: '메일전송에 실패하였습니다' });
                smtpTransport.close(); //전송종료
                console.log(err);

                return;
            } else { //에러가 아닐시 
                res.json({ success: true, message: '메일전송하였습니다' });
                smtpTransport.close(); //전송종료
                return;
            }
        })
        
    }
}

module.exports = mailAuth;