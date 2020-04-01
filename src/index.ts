import FileManager from './FileManager'
import Vigenere from './vigenere'

function run() {
  const fileManager = new FileManager(`${__dirname}/cipher.txt`)
  let cipherText = fileManager.read()
  cipherText = cipherText.toLowerCase().split(' ').join('').trim()


  const vigenere = new Vigenere(cipherText)
  const key = vigenere.findKey()
  const plainText = vigenere.decrypt(key)

  console.log('> Key', key)
  console.log('> Plain text', plainText)
}

run()
