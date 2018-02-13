const express = require('express')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')

router.post('/encrypt', function (req, res, next) {
  if (req.body.url) {
    megacrypt.encryptUrl(req.body.url, req.headers.host, response => {
      res.send(response)
    })
  }
})

module.exports = router
