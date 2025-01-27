//구글 클라우드 사용
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer');


// GCS 설정
const storage = new Storage(); // keyFilename 없이 초기화
const bucket = storage.bucket('puer11');

// Multer 설정 (메모리 저장소)
const upload = multer({
    storage: multer.memoryStorage(),
});
module.exports = {
    bucket,
    upload,
};