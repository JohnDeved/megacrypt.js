const express = require('express')
const mega = require('megajs')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')

router.get('/:type/:crypt/:key', function (req, res, next) {
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
    let folder = new mega.File({downloadId: decrypt.folderId, key: decrypt.fileKey, directory: true})
    folder.loadAttributes((err, folder) => {
      if (err) throw err
      let downloadFile = file => {
        res.setHeader('Content-Length', file.size)
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
        file.download(/*{returnCiphertext: true}*/).pipe(res)
      }
      let findFile = file => {
        if (!file.directory) {
          if (file.downloadId.toString() === decrypt.fileId) {
            return downloadFile(file)
          }
        } else {
          file.children.forEach(findFile)
        }
      }
      folder.children.forEach(findFile)
    })
  }
})

module.exports = router
