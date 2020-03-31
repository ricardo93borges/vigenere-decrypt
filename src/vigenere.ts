
interface VigenereTable {
  [key: string]: string;
}

const table: VigenereTable = {
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

export function encrypt(plainText: string, key: string): string {
  plainText = plainText.split(' ').join('').trim().toLowerCase()

  let cipher = ''
  let keyCharIndex = 0
  for (let i = 0; i < plainText.length; i++) {
    if (keyCharIndex > key.length - 1) {
      keyCharIndex = 0
    }

    const lineIndex = key[keyCharIndex]
    const plainTextChar = plainText[i]
    const columnIndex = Object.keys(table).findIndex(k => k === plainTextChar)

    let char = plainTextChar
    if (columnIndex > -1) {
      char = table[lineIndex][columnIndex]
    }

    cipher = cipher.concat(char)
    keyCharIndex++
  }

  return cipher
}

export function decrypt(cipher: string, key: string): string {
  let text = ''
  let keyCharIndex = 0
  for (let i = 0; i < cipher.length; i++) {
    if (keyCharIndex > key.length - 1) {
      keyCharIndex = 0
    }

    const lineIndex = key[keyCharIndex]
    const cipherChar = cipher[i]

    const line = table[lineIndex]
    const columnIndex = line.split('').findIndex(k => k === cipherChar)

    let char: string | undefined = cipherChar
    if (columnIndex > -1) {
      char = Object.keys(table).find((letter, index) => {
        if (index === columnIndex) {
          return letter
        }
      })
    }

    text = char ? text.concat(char) : text.concat(cipher[i])
    keyCharIndex++
  }
  return text
}
