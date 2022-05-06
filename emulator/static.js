/**
 * static.js
 * 
 * This module provides a simplistic emulation of Express's
 * `static` feature. It does not a
 */


const fs = require('fs')     // File System
const path = require('path')
const files = {}


/**
 * Express requires `folder` to be an absolute path, but for
 * simplicity, we use a path relative to the server root here.
 */
const static = (folder) => {
  // folder is relative to the parent directory
  const folderPath = path.join(__dirname, "..", folder)
  // folderPath is absolute

  return (request, response) => {
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
        contents = `The resource ${request.url} was not found`
        status = 404
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
}


module.exports = static