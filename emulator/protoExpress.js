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
 * 3. Add request properties:
 *    + protocol
 *    + orginalUrl
 *    + params
 * 4. Add response functions
 *    + status(code)
 *    + send(message)
 * 5. Provides support for next()
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
    _addProtocolAndUrlTo(request)
    _addStatusAndSendTo(response)

    const queue = _createQueue(request.url)

    const _notFound = () => {
      const { method, url } = request
      response.writeHead(404)
      response.end(`Cannot ${method} ${url}`)
    }

    if (!queue.length) {
      return _notFound()
    }

    let index = 0
    _treatItem()

    /**
     * _treatItem is called on the first matching callback handler
     * and also when next() is called from such a callback.
     * @param {boolean} static_NotFound will be true if the
     *                  call comes from the serveStatic function
     *                  provided by static.js, when no matching
     *                  static file is found
     */
    function _treatItem(static_NotFound) {
      const item = queue[index]
      if (!item) {
        if (static_NotFound) {
          _notFound()
        }

        return
      }

      index += 1
      const { handler, params } = item
      request.params = params

      handler(request, response, _treatItem)
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
   * Add properties to the request object, just as Express does
   */
  const _addProtocolAndUrlTo = (request) => {
    const { url, connection } = request
    request.protocol = connection.encrypted ? 'https' : 'http'
    request.originalUrl = url
  }


  /**
   * Add function to the response object, just as Express does
   */
  const _addStatusAndSendTo = (response) => {
    response.status = (status) => {
      response.writeHead(status)
    }

    response.send = (message) => {
      response.end(message)
    }
  }


  /**
   * _createQueue matches the actual url against endpoints that have
   * been defined by `.use()`. Any substrings in the endpoint
   * that starts with ":" will be treated as parameter names
   */
  const _createQueue = (url) => {
    let queue = []
    let params = {}

    const urlChunks = _getChunks(url) // ["path","to","resource"]

    const _addMatchesToQueue = (endPointChunks, index) => {
      if (endPointChunks.mapped) {
        endPointChunks.every( mapping => {
          // If a match is found, _addToQueueIfMatch will return
          // false and the .every() method will stop processing
          // items.
          return _addToQueueIfMatch(mapping, index)
        })

      } else {
        _addToQueueIfMatch(endPointChunks, index)
      }
    }

    const _addToQueueIfMatch = (endPointChunks, index) => {
      let length = endPointChunks.length

      if (urlChunks.length < length) {
        // Not enough data in the url for this endpoint.
        return true // match not found
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

        queue.push({
          handler,
          params
        })
      }

      return !match // false (to exit .every()) if match was found
    }

    endPoints.forEach(_addMatchesToQueue)

    // If there were no matches, queue will be empty
    return queue
  }


  /**
   * _getChunks splits a string url into an array and returns the
   * array. If an array of urls is provided, each url string is
   * split recursively and an array of arrays is returned.
   */
  const _getChunks = (url) => {
    // "/path/to/treat/" or ["/path/one", "/path/two"]
    if (Array.isArray(url)) {
      const result = url.map( item => _getChunks(item))
      result.mapped = true
      return result
    }

    return url
      .split("/") //            [ "", "path", "to", "treat", ""]
      .filter( chunk => !!chunk) // [ "path", "to", "treat" ]
  }


  return app
}

// Provide functionality for serving static files
createApplication.static = static