const express = require('express')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')

router.post('/encrypt', function (req, res, next) {
  if (req.body.url) {
    let response = megacrypt.encryptUrl(req.body.url)
    response.link = `${req.headers.host}/download/${response.url}/${response.key}`
    res.send(response)
  }
})
router.post('/decrypt', function (req, res, next) {
  if (req.body.url && req.body.key) {
    res.json(megacrypt.decryptUrl(req.body.url, req.body.key))
  }
})

module.exports = router
