import FileManager from './FileManager'
import calculateIC from './ic'

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
  return sorted[0][0]
}

const fileManager = new FileManager(`${__dirname}/cipher2.txt`)
let cipherText = fileManager.read()
cipherText = cipherText.toLowerCase().split(' ').join('').trim()

const keylength = findKeyLength(cipherText)
