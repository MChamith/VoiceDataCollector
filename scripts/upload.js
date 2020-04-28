var fs = require('fs');
const aws = require('aws-sdk');

const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;

// The name of the bucket that you have created
const BUCKET_NAME = 'meetsid-voice-data';

const s3 = new aws.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


const uploadFile = (filePath, DestinationPath) => {
    // Read content from the file
    const fileContent = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: DestinationPath, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

exports.uploadFile = uploadFile
// console.log(type(uploadFile))
// uploadFile('/home/chamith/Documents/Work/Speech/Recorder/web-dictaphone//public/uploads/voice.m4a', 'VoiceData/voice.m4a');