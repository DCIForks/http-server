/**
 * server.js
 * 
 * This script is designed to work either with the official 
 * Express node package, or with a custom script:
 * protoExpress.js. To choose which to use run either...
 * 
 *   npm start
 * 
 * ... to use the protoExpress.js module, or...
 * 
 *   USE_EXPRESS=true npm start
 * 
 * ... to use the official Express package.
 * 
 * The protoExpress script mimics some of the core features of
 * the Express module.
 * 
 * In particular:
 * 
 * 1. The `app` constant is set to a function that is returned
 *     by a call to the express() function
 * 2. This script makes calls to:
 *    + app.use()
 *    + app.listen()
 * 3. app.use() expects two arguments: an endpoint definition and
 *    a function that will send a response from that endpoint.
 *    If only a function is given, the catchall endpoint "*"
 *    is used by default.
 * 4. The endpoint definition may either be a string or an array
 *    of strings.
 * 5. Functions applied to endpoints (set by app.use()):
 *    + Accept three arguments:
 *      • request
 *      • response
 *      • next
 *    + Add a properties to the `request` object
 *      • protocol
 *      • originalUrl
 *      • params
 *    + Add functions to the `response` object
 *      • status
 *      • send
 * 6. If a `next` argument is given and next() is called, the
 *    next endpoint that matches the current url will be triggered
 * 7. The express function provides a `static` method to define
 *    the path to a folder that contains static files that can be
 *    served just as they are
 * 8. Default response if the requested resource cannot be found
 */


let express
let port

if (process.env.USE_EXPRESS) {
  express = require('express')
  port = 8888
} else {
  express = require('./emulator/protoExpress')
  port = 8080
}

const app = express()


// Display the url for every request
// Multiple endpoints are defined, to show that the params
// depend on the definition of the endpoint. The params captured
// by different app.use() calls may therefore be different.
app.use(["/:one/:two", "/:only", "/"],(request, response, next) => {
  const { protocol, headers, originalUrl:url } = request
  console.log(`
Request received for ${protocol}://${headers.host}${url}
Incoming: request.params: ${JSON.stringify(request.params)}`)

  // Continue calling any other matching endpoints
  next()
})


// "/hello" with one or more additional substrings will provide
// a `name` param which can be merged into the response.
app.use("/hello/:name", (request, response, next) => {
  console.log(
    "Treating: request.params:", JSON.stringify(request.params)
  );
  
  const { name } = request.params
  response.send(`Hello ${name}!`)
})


// "/hello" with no parameters sends a predefined text response
app.use("/hello", (request, response) => {
  response.send(`Hello World!`)
})


// If none of the above endpoints match request.url, a static
// file will be served, if one exists at the given location
// inside the "public" directory. The "/" endpoint is implied.
app.use(express.static("public"))
// If no matching files are found, next() will be called internally
// by express.static, so a catchall endpoint below will be 
// triggered.


// // Serve a simple text response for all other urls.
// app.use("/", (request, response) => {
//   response.send(
//     "Welcome to a simple Express server!"
//   )
// })


// // Alternatively, comment out the endpoint above and explicitly
// // serve a 404 error for all unknown urls
// app.use((request, response) => {
//   response.status(404)
//   response.send(`Resource ${request.url} not found`)
// })


app.listen(port, () => {
  console.log(`Ctrl-click to visit http://localhost:${port}`)
})