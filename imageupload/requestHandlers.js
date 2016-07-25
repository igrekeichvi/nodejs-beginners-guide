var querystring = require('querystring'),
fs = require('fs'),
formidable = require('formidable');

function start(response, request) {
    console.log('Request handler start was called');
    
    
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="file" name="image"/>'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';
    
    writeOk(response)
    response.write(body);
    response.end();
    
}

function upload(response, request) {
    console.log('Request handler upload was called.');

    var form = new formidable.IncomingForm();
    
    form.on('file', function(name, file) {
        fs.createReadStream(file.path).pipe(fs.createWriteStream('./tmp/test.png').on('close', function() {
            console.log('on end writing file');   
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("received image:<br/>");
            response.write("<img src='/show' />");
            response.end();
        }));
    });

    form.parse(request);
}

function show(response) {
    console.log('Request handler \'show\' was called.');
    writeOk(response);
    fs.createReadStream('./tmp/test.png').pipe(response);
}

function writeOk(response) {
    response.writeHead(200, '{"Content-Type": "text/plain"}');
}

exports.start = start;
exports.upload = upload;
exports.show = show;