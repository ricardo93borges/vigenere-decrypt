import fs from 'fs'

export default class FileManager {
  private file: string

  constructor(file: string) {
    this.file = file
  }

  read() {
    const content = fs.readFileSync(this.file, 'utf-8')
    return content
  }
}
