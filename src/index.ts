import FileManager from './FileManager'
import Vigenere, { Keys } from './vigenere'
import * as readline from 'readline-sync'

function printTable(keys: Keys, keylength: number): void {
  for (let i = 0; i < keylength; i++) {
    const chars = keys[i].map(obj => obj.char)
    console.log(`${i}|${chars.join('|')}`)
  }
}

function run() {
  // Read file
  const fileManager = new FileManager(`${__dirname}/cipher.txt`)
  let cipherText = fileManager.read()
  cipherText = cipherText.toLowerCase().split(' ').join('').trim()

  // Get key
  const vigenere = new Vigenere(cipherText)
  const keys = vigenere.findKey()
  let key = ''

  if (vigenere.keylength) {
    console.info('> key length: ', vigenere.keylength, '\n')

    printTable(keys, vigenere.keylength)

    for (let i = 0; i < vigenere.keylength; i++) {
      console.info(`\n> Most likely letters for ${i + 1}ª character of the key`)

      const input = readline.keyInSelect(
        keys[i].map(
          obj => `${obj.char} - ${obj.frequency.toFixed(4)} %`
        ),
        '> Which character?'
      )

      const index = input > -1 ? input : 0
      key = key.concat(keys[i][index].char)
    }
    console.log('\n> Key: ', key)

    const plainText = vigenere.decrypt(key)
    console.log('\n> Plain text', plainText)
  } else {
    console.log('key length no found')
  }
}

run()
