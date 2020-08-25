const express = require('express')
var cookieParser = require('cookie-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()


// Import internal API routers
var indexRouter = require('./routes/index');
var authTokenRouter = require('./auth/token');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {

  // Register internal API endpoints First
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/api/v1/home/', indexRouter);
  // // NOTE: Disable Request Proxy. Directly Call Backend API
  // app.use('/api/v1/auth/', authTokenRouter);

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
