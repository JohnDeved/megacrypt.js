const express = require('express')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')
const config = require('../config')
router.post('/encrypt', function (req, res, next) {
  if (req.body.url && config.encrytionApi) {
    megacrypt.encryptUrl(req.body.url, config.domain ? config.host : `${config.host}:${config.port}`, response => {
      res.send(response)
    })
  }
})
module.exports = router
