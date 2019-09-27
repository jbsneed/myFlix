const http = require("http"),
  url = require("url"),
  fs = require("fs");

http
  .createServer((request, response) => {
    var addr = request.url,
      q = url.parse(addr, true),
      filepath = "";

    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filepath = "index.html";
    }
    fs.readFile(filePath, function(err, data) {
      if (err) {
        throw err;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);

fs.appendFile(
  "log.txt",
  "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Added to log.");
    }
  }
);
