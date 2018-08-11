import Crypto from 'crypto'

export const encryptData = (data, password, iv, algorithm = 'aes-256-cbc') => {
  if (!data) throw new Error('Data must not be null')

  const hash = Crypto.createHash('sha256')
  const key = hash.update(password).digest('hex').slice(0, 32)

  let cipher = Crypto.createCipheriv(algorithm, key, iv)
  return Buffer.concat([cipher.update(data), cipher.final()])
}

export const decryptData = (encryptedData, password, iv, algorithm = 'aes-256-cbc') => {
  if (!encryptedData) throw new Error('Data must not be null')
  const hash = Crypto.createHash('sha256')
  const key = hash.update(password).digest('hex').slice(0, 32)

  const decipher = Crypto.createDecipheriv(algorithm, key, iv)
  const decrypted = Buffer.concat([decipher.update(encryptedData, 'utf8'), decipher.final()])
  return decrypted
}

export const hashPassword = (password) => {
  const sha256 = Crypto.createHash('sha256')
  const hashPass = sha256.update(sha256.update(password).digest('hex')).digest('hex')
  return hashPass
}

export const encryptString = (string, password, iv, algorithm = 'aes-256-cbc') => {

  const dataBuff = new Buffer(string, 'utf8')
  const encrypted = encryptData(dataBuff, password, iv, algorithm)
  return encrypted.toString('hex')
}

export const decryptString = (string, password, iv, algorithm = 'aes-256-cbc') => {
  const dataBuff = new Buffer(string, 'hex')
  const decrypted = decryptData(dataBuff, password, iv, algorithm)
  return decrypted.toString()
}

export default {
  encryptData,
  decryptData,
  hashPassword,
  encryptString,
  decryptString
}
