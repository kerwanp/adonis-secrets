import { BaseCommand, flags } from '@adonisjs/core/ace'
import fs from 'node:fs/promises'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class EnvEncrypt extends BaseCommand {
  static commandName = 'env:encrypt'
  static description = 'Encrypt environment variables'
  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({
    description: 'Forces the replacement of the encrypted file if it exists',
    default: false,
  })
  declare force: boolean

  private get environment() {
    return process.env.NODE_ENV ?? 'development'
  }

  private get decryptedFilePath() {
    if (this.environment === 'development') {
      return this.app.makePath(`.env.local`)
    }

    return this.app.makePath(`.env.${this.environment}`)
  }

  private get encryptedFilePath() {
    return `${this.decryptedFilePath}.encrypted`
  }

  private async fileExists(path: string) {
    return fs
      .readFile(path)
      .then(() => true)
      .catch(() => false)
  }

  async run() {
    if (!(await this.fileExists(this.decryptedFilePath))) {
      this.logger.error(
        new Error(`The environment variables file "${this.decryptedFilePath} does not exist"`)
      )
      return
    }

    if ((await this.fileExists(this.encryptedFilePath)) && !this.force) {
      this.logger.error(
        new Error(
          `An encrypted file for this environment already exist ("${this.encryptedFilePath}"). Use "--force" to overwrite it.`
        )
      )
      return
    }

    const encryption = await this.app.container.make('encryption')
    const decrypted = await fs.readFile(this.decryptedFilePath)
    const encrypted = encryption.encrypt(decrypted)
    await fs.writeFile(this.encryptedFilePath, encrypted)

    this.logger.success(
      `The file "${this.decryptedFilePath}" has been successfully decrypted to "${this.decryptedFilePath}"`
    )
  }
}
