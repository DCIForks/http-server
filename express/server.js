/**
 * server.js
 * 
 * To start this Express server, from the parent directory:
 * 
 *   npm run express
 */


const express = require('express')
const app = express()

const PORT = 8888


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
app.use(express.static("public"))


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