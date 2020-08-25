require('dotenv').config()
var express = require('express');
var router = express.Router();
var axios = require('axios')
var accessJson = require("../client_token.json")
var appCache = require("../helpers/cacheHelper")



router.post('/login',
 async function(req, res, next) {

  let url = `${process.env.API_HOST}/api/v1/auth/login/`

  let status = null
  let data = null

  let body = {...accessJson, ...req.body}

  await axios.post(url, body)
  .then(function(response) {
    status = response.status
    data = response.data
  })
  .catch(function(error) {
    try {
      status = error.response.status
      data = error.response.data
    } catch (error) {
      status = 500
      data = "Node: Unhandled Exception"
    }
  })

  res.status(status)
     .send(data)
})


router.get('/current-user',
 async function(req, res, next) {

  let url = `${process.env.API_HOST}/api/v1/auth/current-user/`
  let token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : ""

  let cacheKey = `${token}-current-user`

  let cacheValue = appCache.getValue(cacheKey)
  if (cacheValue) {
    res.status(200)
       .send(cacheValue)
    return
  }

  let status = null
  let data = null

  await axios.get(url, { headers: { "Authorization": `Bearer ${token}`} })
  .then(function(response) {
    status = response.status
    data = response.data
  })
  .catch(function(error) {
    try {
      status = error.response.status
      data = error.response.data
    } catch (error) {
      status = 500
      data = "Node: Unhandled Exception"
    }
  })

  appCache.setValue({
    key: cacheKey,
    val: data
  })

  res.status(status)
     .send(data)
})


router.get('/current-user/scope',
 async function(req, res, next) {

  let url = `${process.env.API_HOST}/api/v1/auth/current-user/scope/`
  let token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : ""

  let cacheKey = `${token}-current-user-scope`

  let cacheValue = appCache.getValue(cacheKey)
  if (cacheValue) {
    res.status(200)
       .send(cacheValue)
    return
  }

  let status = null
  let data = null

  await axios.get(url, { headers: { "Authorization": `Bearer ${token}`} })
  .then(function(response) {
    status = response.status
    data = response.data
  })
  .catch(function(error) {
    try {
      status = error.response.status
      data = error.response.data
    } catch (error) {
      status = 500
      data = "Node: Unhandled Exception"
    }
  })

  appCache.setValue({
    key: cacheKey,
    val: data
  })

  res.status(status)
     .send(data)
})


module.exports = router;
