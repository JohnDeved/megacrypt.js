const express = require('express')
const mega = require('megajs')
const router = express.Router()
const megacrypt = require('../modules/megacrypt.js')

router.get('/:crypt/:key', function (req, res, next) {
  // https://mega.nz/#!ZckkgZTa!FexZJB-KkPMOrM1qT3cU_5Vqd77531F9RvxHNnAJ2QA
  console.log(req.params)

  let decrypt = megacrypt.decryptUrl(req.params.crypt, req.params.key)
  let file = mega.File.fromURL(`https://mega.nz/#!${decrypt.fileId}!${decrypt.fileKey}`)

  file.loadAttributes((err, file) => {
    if (err) throw err
    res.setHeader('Content-Length', file.size)
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
    file.download().pipe(res)
  })
})

module.exports = router
