const crypto = require('crypto')
const CryptoJS = require('crypto-js')
const base64url = require('base64-url')
const mega = require('megajs')
const async = require('async')
const bytes = require('bytes')
const config = require('../config')

class Megacrypt {
  constructor () {
    this.encryptServer = str => CryptoJS.AES.encrypt(str, config.serverKey).toString()
    this.decryptServer = str => CryptoJS.AES.decrypt(str, config.serverKey).toString(CryptoJS.enc.Utf8)
    this.encryptUrl = (url, host, callback) => {
      if (/\/\/mega\.nz\/#![\d\w]+![\d\w-]+/.test(url)) {
        let response = {}
        let [, fileId, fileKey] = url.split('!')
        let cryptKey = crypto.randomBytes(32).toString('base64')
        let crypt = CryptoJS.AES.encrypt(`${fileId}!${fileKey}`, cryptKey).toString()
        let link = this.encryptServer(`${crypt}!${cryptKey}`)
        response.link = `http://${host}/dl/_/${base64url.escape(link)}`

        let file = new mega.File({downloadId: fileId, key: fileKey, directory: false})
        file.loadAttributes((err, file) => {
          if (err) throw err
          response.name = file.name
          response.size = bytes(file.size)
          callback([response])
        })
      } else if (/\/\/mega\.nz\/#F![\d\w]+![\d\w-]+/.test(url)) {
        let [, downloadId, fileKey] = url.split('!')
        let folder = new mega.File({downloadId: downloadId, key: fileKey, directory: true})
        folder.loadAttributes((err, folder) => {
          if (err) throw err
          let links = []
          let files = []
          let pushFiles = file => file.directory ? async.each(file.children, pushFiles, console.log) : files.push(file)
          async.each(folder.children, pushFiles, console.log)
          async.each(files, file => {
            if (!file.directory) {
              let response = {}
              let cryptKey = crypto.randomBytes(32).toString('base64')
              let crypt = CryptoJS.AES.encrypt(`${file.downloadId}!${downloadId}!${fileKey}`, cryptKey).toString()
              let link = this.encryptServer(`${crypt}!${cryptKey}`)
              response.link = `http://${host}/dl/!/${base64url.escape(link)}`
              response.name = file.name
              response.size = bytes(file.size)
              links.push(response)
            }
          }, console.log)
          callback(links)
        })
      }
    }
    this.decryptUrl = (crypt, type) => {
      if (type === '_') {
        let [decrypt, key] = this.decryptServer(base64url.unescape(crypt)).split('!')
        let [fileId, fileKey] = CryptoJS.AES.decrypt(decrypt, key).toString(CryptoJS.enc.Utf8).split('!')
        return {fileId: fileId, fileKey: fileKey}
      } else if (type === '!') {
        let [decrypt, key] = this.decryptServer(base64url.unescape(crypt)).split('!')
        let [fileId, folderId, fileKey] = CryptoJS.AES.decrypt(base64url.unescape(decrypt), base64url.unescape(key))
        .toString(CryptoJS.enc.Utf8).split('!')
        return {fileId: fileId, folderId: folderId, fileKey: fileKey}
      }
    }
  }
}

module.exports = new Megacrypt()
