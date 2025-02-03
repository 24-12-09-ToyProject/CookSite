const multer = require('multer');
const path = require('path');

// 파일 저장 위치 및 파일 이름 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // 업로드 폴더 설정
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // 파일 이름 설정
    }
});

// 파일 업로드 미들웨어 설정
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        // 파일 타입 필터링 (예: 이미지 파일만)
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('이미지 파일만 업로드 할 수 있습니다.');
        }
    }
});

module.exports = upload;
