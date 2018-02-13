const express = require('express')
const router = express.Router()
const config = require('../config')

/* GET home page. */
router.get('/', function (req, res, next) {
  if (config.encryptionTool) {
    res.render('index')
  } else {
    res.send('sry, the encryption tool has been disabled for this site...')
  }
})

module.exports = router
