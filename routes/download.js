const express = require('express')
const mega = require('megajs')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')

router.get('/:type/:crypt/:key', function (req, res, next) {
  console.log(req.params)
  let decrypt = megacrypt.decryptUrl(req.params.crypt, req.params.key, req.params.type)

  if (req.params.type === '_') {
    let file = new mega.File({downloadId: decrypt.fileId, key: decrypt.fileKey, directory: false})

    file.loadAttributes((err, file) => {
      if (err) throw err
      res.setHeader('Content-Length', file.size)
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
      file.download(/*{returnCiphertext: true}*/).pipe(res)
    })
  } else if (req.params.type === '!') {
    let file = new mega.File({downloadId: decrypt.folderId, key: decrypt.fileKey, directory: true})

    file.loadAttributes((err, file) => {
      if (err) throw err
      file = file.children.filter(f => f.downloadId.toString() === decrypt.fileId).shift()
      res.setHeader('Content-Length', file.size)
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
      file.download(/*{returnCiphertext: true}*/).pipe(res)
    })
  }
})

module.exports = router
