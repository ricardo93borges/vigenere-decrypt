import { alphabet } from './alphabet'

interface Occurrences {
  [key: string]: number;
}

export default function calculateIC(str: string): number {
  str = str.toLowerCase().split(' ').join('').trim()

  const occurrences: Occurrences = {}
  let sum = 0

  for (let i = 0; i < alphabet.length; i++)
    occurrences[alphabet[i]] = 0

  for (let i = 0; i < str.length; i++)
    occurrences[str[i]]++

  for (let i = 0; i < alphabet.length; i++)
    sum = sum + occurrences[alphabet[i]] * (occurrences[alphabet[i]] - 1)

  const ic = sum / (str.length * (str.length - 1))
  return ic
}
