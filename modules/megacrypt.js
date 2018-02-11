const crypto = require('crypto')
const CryptoJS = require('crypto-js')
const base64url = require('base64-url')

class Megacrypt {
  constructor () {
    this.encryptUrl = url => {
      if (/\/\/mega\.nz\/#![\d\w]+![\d\w-]+/.test(url)) {
        let [, fileId, fileKey] = url.split('!')
        let cryptKey = crypto.randomBytes(32).toString('base64')
        let crypt = CryptoJS.AES.encrypt(`${fileId}!${fileKey}`, cryptKey)
        return {url: base64url.escape(crypt.toString()), key: base64url.escape(cryptKey)}
      }
    }
    this.decryptUrl = (crypt, key) => {
      let [fileId, fileKey] = CryptoJS.AES.decrypt(base64url.unescape(crypt), base64url.unescape(key)).toString(CryptoJS.enc.Utf8).split('!')
      return {fileId: fileId, fileKey: fileKey}
    }
  }
}

module.exports = new Megacrypt()
