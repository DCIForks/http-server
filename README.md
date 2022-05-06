# Exploring the http server module

This repository demonstrates two servers that depend on the built-in Node.js http module: barebones.js, and the more complex server.js, which emulates the basic features of Express. It also includes a server created with Express for comparison.

## barebones.js

Run `node barebones`, or `npm run simple` if you have `nodemon` installed.

The `barebones.js` script creates the simplest possible server using the `http` module. It consists of a `listener` function that accepts two arguments:

1. The incoming request from the browser
2. An object that can be used to respond to the request

In this example, the incoming request is ignored; the same hard-coded content is returned for all requests made to http://localhost:8000, regardless of the exact url.

## server.js

Run `npm start`

Not implemented:
* next()
* skipping static if no resource found


## express/server.js

Run `npm run express`.

The server.js file in the express directory is almost identical to the server.js file at the root, except that it use the real Express module rather than an emulated one.



**To run:** `npm run express`

## DigitalOcean Tutorial 
https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module