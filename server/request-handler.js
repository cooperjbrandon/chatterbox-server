/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

 var fs = require("fs");


 var messages = [];
 var counter = 0;

 var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
  * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  // console.log(request);
  // console.log(request.headers['access-control-request-method']);
  // console.log(request.headers);
  // console.log("Serving request type " + request.method + " for url " + request.url);
  var headers;
  var statusCode;

  // console.log(request.headers.accept);
  var type = request.headers.accept.split(',')[0];

  if (type === 'text/html') {
    console.log("request for html :" + type);

    headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/html";
    // console.log(statusCode);
    /* .writeHead() tells our server what HTTP status code to send back */
    response.writeHead(200, headers);

    fs.readFile("../2013-11-chatterbox-clientMINE/client/index.html", function (err, data) {
      console.log("Read index.html");
      if (err) {
        response.writeHead(500, headers);
        return response.end('Error loading index.html');
      }
      response.end(data);
    });

  } else if (type === 'text/css') {
      headers = defaultCorsHeaders;
      headers['Content-Type'] = "text/css";
      // console.log(statusCode);
      /* .writeHead() tells our server what HTTP status code to send back */
      response.writeHead(200, headers);

      fs.readFile("../2013-11-chatterbox-clientMINE/client/styles/styles.css", function (err, data) {
        console.log("Read css.styles");
        if (err) {
          response.writeHead(500, headers);
          return response.end('Error loading styles.css');
        }
        response.end(data);
      });
  } else if (request['Content-Type']) {
    if (request.url === '/classes/messages') {
      if (request.headers['access-control-request-method'] === 'POST' || request.method === 'POST') {
        statusCode = 201;
      } else {
        statusCode = 200;
      }
    } else if (request.url === 'http://127.0.0.1:8080/classes/room1') {
     if (request.method === 'POST') {
      statusCode = 201;
    } else {
      statusCode = 200;
    }
  } else {
    statusCode = 404;
  }


  if (request.method === 'POST') {
    request.on('data', function(message) {
      message = JSON.parse(message);
      message.objectId = counter;
      counter++;
      messages.unshift(message);
    });
  }

  /* Without this line, this server wouldn't work. See the note
  * below about CORS. */
  headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  // console.log(statusCode);
  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  // Body of the http request
  // response.write('[]');

  response.end(JSON.stringify(messages));
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
 } else {
  fs.readFile("../2013-11-chatterbox-clientMINE/client/index.html", function (err, data) {
    console.log("Read index.html");
    if (err) {
      response.writeHead(500, headers);
      return response.end('Error loading index.html');
    }
    response.end(data);
  });
}
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;