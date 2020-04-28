var express = require('express');
var multer = require('multer');
var uploader = require('./scripts/upload');
var app = express();
var mkdirp = require('mkdirp');
var https = require('https');
var fs = require('fs');

var privateKey = fs.readFileSync('selfsigned.key', 'utf8');
var certificate = fs.readFileSync('selfsigned.crt', 'utf8');
var credentials = {
	key: privateKey,
	cert: certificate
};

app.use(express.static('scripts')); // for serving the HTML file
app.use(express.static('./'));
// var filename;

// var storage = multer.diskStorage({
// 	destination: function(req, file, cb) {
// 		dir = __dirname + '/public/uploads/'
// 		cb(null,dir )
// 	},
// 	filename: function(req, file, cb) {
// 		filename = Date.now()+'.m4a';
// 		// req.filename = filename
// 		cb(null, filename)
// 	}
// })



// // var upload = multer({ dest: __dirname + '/public/uploads/', filename:'voice.m4a' });
// var upload = multer({
// 	storage: storage
// })
// var type = upload.single('upl');
// // console.log()
// app.post('/api/save', type, function(req, res) {
// 	username = req.body.username;
// 	phraseNo = req.body.phraseNumber
// 	filename = req.file.filename
// 	console.log('filename ', filename)
// 	uploader.uploadFile('public/uploads/'+filename, 'VoiceData/' + username + '/phrase' + phraseNo + '/'+filename);

// });


var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8080);
httpsServer.listen(3000);



// var http = require('http');
// var fs = require('fs');
// var url = require("url");

// http.createServer(function (request, response) {

//     var pathname = url.parse(request.url).pathname;
//     console.log("Request for " + pathname + " received.");

//     response.writeHead(200);

//     if(pathname == "/") {
//         html = fs.readFileSync("index.html", "utf8");
//         response.write(html);
//     } else if (pathname == "/scripts/app.js") {
//         script = fs.readFileSync("scripts/app.js", "utf8");
//         response.write(script);
//     }
//     else if (pathname == "/styles/app.css") {
//         script = fs.readFileSync("styles/app.css", "utf8");
//         response.write(script);
//     }


//     response.end();
// }).listen(8888);

// console.log("Listening to server on 8888...");