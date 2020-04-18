import calculateIC from './ic'
import { alphabet } from './alphabet'

interface PossibleLengths {
  [key: number]: number;
}

interface VigenereTable {
  [key: string]: string;
}

interface Key {
  char: string;
  frequency: number;
}

export interface Keys {
  [key: number]: Key[];
}

export default class Vigenere {
  private cipher: string
  public keylength?: number
  private table: VigenereTable = {
    'a': 'abcdefghijklmnopqrstuvwxyz',
    'b': 'bcdefghijklmnopqrstuvwxyza',
    'c': 'cdefghijklmnopqrstuvwxyzab',
    'd': 'defghijklmnopqrstuvwxyzabc',
    'e': 'efghijklmnopqrstuvwxyzabcd',
    'f': 'fghijklmnopqrstuvwxyzabcde',
    'g': 'ghijklmnopqrstuvwxyzabcdef',
    'h': 'hijklmnopqrstuvwxyzabcdefg',
    'i': 'ijklmnopqrstuvwxyzabcdefgh',
    'j': 'jklmnopqrstuvwxyzabcdefghi',
    'k': 'klmnopqrstuvwxyzabcdefghij',
    'l': 'lmnopqrstuvwxyzabcdefghijk',
    'm': 'mnopqrstuvwxyzabcdefghijkl',
    'n': 'nopqrstuvwxyzabcdefghijklm',
    'o': 'opqrstuvwxyzabcdefghijklmn',
    'p': 'pqrstuvwxyzabcdefghijklmno',
    'q': 'qrstuvwxyzabcdefghijklmnop',
    'r': 'rstuvwxyzabcdefghijklmnopq',
    's': 'stuvwxyzabcdefghijklmnopqr',
    't': 'tuvwxyzabcdefghijklmnopqrs',
    'u': 'uvwxyzabcdefghijklmnopqrst',
    'v': 'vwxyzabcdefghijklmnopqrstu',
    'w': 'wxyzabcdefghijklmnopqrstuv',
    'x': 'xyzabcdefghijklmnopqrstuvw',
    'y': 'yzabcdefghijklmnopqrstuvwx',
    'z': 'zabcdefghijklmnopqrstuvwxy'
  }

  constructor(cipher: string) {
    this.cipher = cipher
  }

  encrypt(plainText: string, key: string): string {
    plainText = plainText.split(' ').join('').trim().toLowerCase()

    let cipher = ''
    let keyCharIndex = 0
    for (let i = 0; i < plainText.length; i++) {
      if (keyCharIndex > key.length - 1) {
        keyCharIndex = 0
      }

      const lineIndex = key[keyCharIndex]
      const plainTextChar = plainText[i]
      const columnIndex = Object.keys(this.table).findIndex(k => k === plainTextChar)

      let char = plainTextChar
      if (columnIndex > -1) {
        char = this.table[lineIndex][columnIndex]
      }

      cipher = cipher.concat(char)
      keyCharIndex++
    }

    return cipher
  }

  decrypt(key: string): string {
    let text = ''
    let keyCharIndex = 0
    for (let i = 0; i < this.cipher.length; i++) {
      if (keyCharIndex > key.length - 1) {
        keyCharIndex = 0
      }

      const lineIndex = key[keyCharIndex]
      const cipherChar = this.cipher[i]

      const line = this.table[lineIndex]
      const columnIndex = line.split('').findIndex(k => k === cipherChar)

      let char: string | undefined = cipherChar
      if (columnIndex > -1) {
        char = Object.keys(this.table).find((letter, index) => {
          if (index === columnIndex) {
            return letter
          }
        })
      }

      text = char ? text.concat(char) : text.concat(this.cipher[i])
      keyCharIndex++
    }
    return text
  }

  average(arr: number[]): number {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]
    }
    return sum / arr.length
  }

  sort(possibleLengths: PossibleLengths): any[][] {
    const sortable = []
    for (const length in possibleLengths)
      sortable.push(possibleLengths[length])

    const sorted = Object.entries(possibleLengths).sort((a, b) => a[1] < b[1] ? 1 : -1)
    return sorted
  }

  findKeyLength(cipherText: string): number {
    const possibleLengths: PossibleLengths = {}

    for (let keylength = 2; keylength < 15; keylength++) {
      const ICs = []

      for (let j = 0; j < keylength; j++) {
        const letters = []
        let currentIndex = j

        letters.push(cipherText[currentIndex])

        for (let i = j; i < cipherText.length / keylength; i++) {
          currentIndex += keylength
          letters.push(cipherText[currentIndex])
        }

        ICs.push(calculateIC(letters.join('')))
      }

      possibleLengths[keylength] = this.average(ICs)
    }

    const sorted = this.sort(possibleLengths)
    const keylength = parseInt(sorted[0][0], 10)
    this.keylength = keylength
    return keylength
  }

  frequencyAnalysis(substring: string): { [key: string]: number } {
    const ocurrencies: { [key: string]: number } = {}

    for (let j = 0; j < alphabet.length; j++) {
      ocurrencies[alphabet[j]] = 0
    }

    for (let i = 0; i < substring.length; i++) {
      ocurrencies[substring[i]]++
    }

    for (let j = 0; j < alphabet.length; j++) {
      ocurrencies[alphabet[j]] = ocurrencies[alphabet[j]] / substring.length
    }

    return ocurrencies
  }

  findKey(): Keys {
    const keylength = this.findKeyLength(this.cipher)

    // frequency analysis
    const keys: Keys = {}
    let i = 0
    while (i < keylength) {
      let currentIndex = i
      keys[i] = []
      const letters = []
      letters.push(this.cipher[currentIndex])

      while (currentIndex + keylength < this.cipher.length) {
        currentIndex = currentIndex + keylength
        letters.push(this.cipher[currentIndex])
      }

      const substring = letters.join('')
      const frequencies = this.frequencyAnalysis(substring)

      const sorted = Object.entries(frequencies).sort((a, b) => a[1] < b[1] ? 1 : -1)

      keys[i].push({ char: sorted[0][0], frequency: sorted[0][1] })
      keys[i].push({ char: sorted[1][0], frequency: sorted[1][1] })
      keys[i].push({ char: sorted[2][0], frequency: sorted[2][1] })

      i++
    }

    return keys
  }

}