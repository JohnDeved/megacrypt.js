const express = require('express')
const mega = require('megajs')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')

router.get('/:crypt/:key', function (req, res, next) {
  console.log(req.params)

  let decrypt = megacrypt.decryptUrl(req.params.crypt, req.params.key)
  let file = new mega.File({downloadId: decrypt.fileId, key: decrypt.fileKey, directory: false})

  file.loadAttributes((err, file) => {
    if (err) throw err
    res.setHeader('Content-Length', file.size)
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
    file.download(/*{returnCiphertext: true}*/).pipe(res)
  })
})

module.exports = router
