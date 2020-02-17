const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/index');


aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: 'us-east-2',
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid mime type: must be jpeg or png'), false);
    }
}

const upload = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'matcha42',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'testing_meta_data!' });
        },
        key: function (req, file, cb) {
            cb(null, 'pedronunezcode' + Date.now().toString())
        }
    })
});

module.exports = upload;