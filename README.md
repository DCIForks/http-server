# Exploring the http server module

This repository demonstrates two servers that depend on the built-in Node.js http module: the simplistic barebones.js, and the more complex server.js, which emulates the basic features of Express. You can also run server.js using Express itself, to compare the functionality..

## barebones.js

Run `node barebones`, or `npm run bones` if you have `nodemon` installed.

The `barebones.js` script creates the simplest possible server using the `http` module. It consists of a `listener` function that accepts two arguments:

1. The incoming request from the browser
2. An object that can be used to respond to the request

In this example, the incoming request is ignored; the same hard-coded content is returned for all requests made to http://localhost:8000, regardless of the exact url.

## server.js

The `server.js` file can be run either using the files in the `emulator/` folder or using Express.


Run with the emulator on port 8080:

`node server` or `npm run emulator`

Run with express on port 8888:

`USE_EXPRESS=true node server` or `npm run express`

To run both together: `npm start`

## Emulator Features

The emulator consists of two files in the `emulator/` folder: `protoExpress.js` and `static.js`.

The **`protoExpress.js`** script emulates the following features:
* It exports a function similar to the `express` function
* `const app = express()`
* `app.use(<endpoint>, <method>)`
* `app.use(<method>)`
* `app.use([<endpoint>, ...], <method>])`
* `app.use(express.static(<path>))`
* The callback method accepts the arguments `(request, response, next)` where `request` and `response` are objects generated by the `http` server module, and `next` can be a function which will be called sequentially.
* The `request` object is supplemented by three custom properties:
  + `protocol` (e.g. `https`)
  + `originalUrl` (e.g. `/index.html`)
  + `params` (read from the url, where the endpoint string has `:param-name` sections)
* The `response` object is supplemented by two functions:
  + `status(code)` to set the status code (e.g. 404)
  + `send(message)` to return a text or html string
* The server returns a message such as `Cannot GET /unknownFile` if the requested url cannot be resolved.

The **`static.js`** script adds support for static files, such as HTML pages and SVG images in a `public/` folder. It does not handle other media types, such as PNG or JPEG images.

## DigitalOcean Tutorial 

For a step-by-step guide on how to write an `http` server so that it can return other media types, such as JSON or CSV files, see this [Digital Ocean tutorial](https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module).