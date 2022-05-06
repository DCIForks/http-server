const http = require('http')
const PORT = 8000


const listener = (request, response) => {
  response.writeHead(200)
  response.end("Response from barebones server")
}


const server = http.createServer(listener)


server.listen(PORT, () => {
  console.log(`Ctrl-click to visit http://localhost:${PORT}`)
})
