//https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);



app.use("/test", function (req, res) {
  
})