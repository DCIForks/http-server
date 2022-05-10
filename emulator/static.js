/**
 * static.js
 *
 * This module provides a simplistic emulation of Express's
 * `static` feature.
 *
 * The first time a static file is requested, it is read in to
 * a variable and cached for later re-use.
 *
 * NOTE: no support is given for media files such as PNG or JPG.
 * SVG files are in fact text-based, so they work without any
 * special support.
 */


const fs = require('fs')     // File System
const path = require('path')
const files = {}


/**
 * Express allows `folder` to be an absolute path, but for
 * simplicity, we just use a path relative to the server root here.
 */
const static = (folder) => {
  // folder is relative to the parent directory
  const folderPath = path.join(__dirname, "..", folder)
  // folderPath is absolute

  const serveStatic = (request, response, next) => {
    // Get the path to the requested resource
    const urlPath = request.url === "/"
                  ? "/index.html"
                  : request.url
    const filePath = path.join(folderPath, urlPath)

    // Check if the resource (or the lack of it) has been cached
    let data = files[filePath]

    if (!data) {
      // Read in and cache the file, if it is available...
      let contents
      let status

      if (fs.existsSync(filePath)) {
        contents = fs.readFileSync(filePath, "utf-8")
        status = 200

      } else {
        // No file found. Ignore the static path and try the
        // next valid endpoint
        return next(true)
      }

      data = {
        contents,
        status
      }

      // Cache the data for this file for next time
      files[filePath] = data
    }

    // Respond with the (cached) static content
    response.statusCode = data.status
    response.end(data.contents)
  }

  return serveStatic
}


module.exports = static