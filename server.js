/**
 * server.js
 * 
 * To start this server, run:
 * 
 *   node server
 * 
 * This script depends on a protoExpress script, which mimics
 * some of the core features of the Express module.
 * 
 * In particular:
 * 
 * 1. The `app` constant is set to a function that is returned
 *     by a call to protoExpress()
 * 2. This script makes calls to
 *    + app.use()
 *    + app.listen()
 * 3. Calls to app.use()
 *    + Add a `send` function to the `response` object
 *    + Add a params object to the `request` object
 * 4. app.use() expects two arguments: an endpoint string and
 *    a function that will send a response from that endpoint.
 *    If only a function is given, the catchall endpoint "*"
 *    is used by default.
 * 5. 
 * 6. The protoExpress function provides a `static` method
 *    to define the path to a folder that contains static
 *    files that can be served just as they are
 */


const protoExpress = require('./emulator/protoExpress')
const app = protoExpress()

const PORT = 8080



// "/hello" with one or more additional substrings will provide
// a `name` param which can be merged into the response.
app.use("/hello/:name", (request, response) => {
  const { name } = request.params

  response.send(`Hello ${name}!`)
})


// "/hello" with no parameters sends a predefined text response
app.use("/hello", (request, response) => {
  response.send(`Hello World!`)
})


// If none of the above endpoints match request.url, a static
// file will be served, if one exists at the given location
// inside the "public" directory. The "*" endpoint is implied.
app.use(protoExpress.static("public"))


// Serve a simple text response for all other urls.
app.use("/", (request, response) => {
  response.send(
    "Welcome to a simple HTTP server that emulates Express!"
  )
})


// Alternatively, comment out the endpoint above and serve a
// 404 error for all unknown urls
app.use((request, response) => {
  response.status(404)
  response.send(`Resource ${request.url} not found`)
})


app.listen(PORT, () => {
  console.log(`Ctrl-click to visit http://localhost:${PORT}`)
})