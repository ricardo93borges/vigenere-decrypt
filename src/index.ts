import FileManager from './FileManager'
import calculateIC from './ic'
import { alphabet } from './alphabet'

interface PossibleLengths {
  [key: number]: number;
}

function average(arr: number[]): number {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  return sum / arr.length
}

function sort(possibleLengths: PossibleLengths): any[][] {
  const sortable = []
  for (const length in possibleLengths)
    sortable.push(possibleLengths[length])

  const sorted = Object.entries(possibleLengths).sort((a, b) => a[1] < b[1] ? 1 : -1)
  return sorted
}

function findKeyLength(cipherText: string): number {
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

    possibleLengths[keylength] = average(ICs)
  }

  const sorted = sort(possibleLengths)
  return parseInt(sorted[0][0], 10)
}

function frequencyAnalysis(substring: string): { [key: string]: number } {
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

const fileManager = new FileManager(`${__dirname}/cipher.txt`)
let cipherText = fileManager.read()
cipherText = cipherText.toLowerCase().split(' ').join('').trim()

// find key length
const keylength = findKeyLength(cipherText)
console.log('keylength', keylength)
// frequency analysis
let key = ''
let i = 0
while (i < keylength) {
  let currentIndex = i
  const letters = []
  letters.push(cipherText[currentIndex])

  while (currentIndex + keylength < cipherText.length) {
    currentIndex = currentIndex + keylength
    letters.push(cipherText[currentIndex])
  }

  const substring = letters.join('')
  const frequencies = frequencyAnalysis(substring)

  const sorted = Object.entries(frequencies).sort((a, b) => a[1] < b[1] ? 1 : -1)
  //console.log(sorted)
  key = key.concat(sorted[0][0])
  i++
}


console.log(key)