/**
 * protoExpress.js
 * 
 * This module is an emulation of some of the basic features of
 * the Express npm package:
 *   https://www.npmjs.com/package/express
 * 
 * It is based on the built-in `http` module. For the `static`
 * feature, it also indirectly uses the built-in `fs` and `path`
 * modules, for the static feature
 * 
 * Features:
 * 1. app.use()
 * 2. app.listen()
 * 3. Add request.params
 * 4. Add response.send
 * 5. protoExpress.static()
 */


const http = require('http')
const static = require('./static')
const HOST = "localhost" // explicit use of the default value


module.exports = createApplication


function createApplication() {
  // Arrays to store route and handler functions; populated
  // by `.use(route, handler)`. Items at the same index will
  // apply to the given endPoint.
  const endPoints = []
  const handlers  = []

  // Return a function that adds functionality to the `request`
  // and `response` objects, and which calls the appropriate
  // handler, as defined by `.use()`
  const app = (request, response) => {
    const { handler, params } = _parseUrl(request.url)

    request.params = params

    if (handler) {
      response.send = (message) => {
        response.writeHead(200)
        response.end(message)
      }

      response.status = (status) => {
        response.writeHead(status)
      }

      handler(request, response)

    } else {
      // Fallback, in case no 
      response.writeHead(404)
      response.end("Not Found")
    }
  }


  app.use = (route, handler) => {
    if (typeof route === "function") {
      handler = route
      route = "/"
    }
    
    endPoints.push(_getChunks(route))
    handlers.push(handler)
  }


  /**
   * app.listen() is a syntactic sugar for
   * http.createServer(app).listen(...)
   */
  app.listen = (port, callback) => {
    const server = http.createServer(app)

    server.listen(port, HOST, () => {
      if (typeof callback === "function") {
        callback()
      }
    })
  }

  // UTILITIES // UTILITIES // UTILITIES // UTILITIES //

  /**
   * _parseUrl matches the actual url against endpoints that have
   * been defined by `.use()`. Any substrings in the endpoint
   * that starts with ":" will be treated as parameter names
   */
  const _parseUrl = (url) => {
    let handler
    let params = {}

    const urlChunks = _getChunks(url) // ["path","to","resource"]

    endPoints.every((endPointChunks, index) => {
      let length = endPointChunks.length

      if (urlChunks.length < length) {
        // Not enough data in the url for this endpoint.
        // Try the next
        return true
      }

      let chunks = urlChunks.slice(0, length)

      // Do the substrings all match? Let's start by saying
      // "yes"...

      let match = true
      const urlParams = {}

      for ( let ii = 0; ii < length; ii += 1 ) {
        const chunk = chunks[ii]
        const endPointChunk = endPointChunks[ii]

        if (endPointChunk[0] === ":") {
          // This is a param. Strip the leading ":" and consider
          // this part of the match.
          urlParams[endPointChunk.slice(1)] = chunk
        
        } else if (endPointChunk !== chunk) {
          // ... but actually the answer is "no".
          match = false
          break
        }
      }

      if (match) {
        handler = handlers[index]
        params = urlParams
        // We have found a match. Don't return true
        // .every() will now exit

      } else {
        return true // try next route
      }
    })

    // If there was no match, handler will be undefined and
    // params will still be {}
    return {
      handler,
      params
    }
  }


  const _getChunks = (url) => {
    // "/path/to/treat/"
    return url
      .split("/") //            [ "", "path", "to", "treat", ""]
      .filter( chunk => !!chunk) // [ "path", "to", "treat" ]
  }


  return app
}

// Add functionality for serving static files
createApplication.static = static