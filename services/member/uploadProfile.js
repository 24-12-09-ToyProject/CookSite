const multer = require('multer');
const path = require('path');

// 파일 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_PATH +'member/'); // 업로드된 파일을 저장할 폴더
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
  }
});

const upload = multer({ storage: storage });




module.exports = {
	upload
}