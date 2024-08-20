import { BaseCommand, flags } from '@adonisjs/core/ace'
import fs from 'node:fs/promises'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class EnvDecrypt extends BaseCommand {
  static commandName = 'env:decrypt'
  static description = 'Decrypt environment variables'
  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({
    description: 'Forces the replacement of the decrypted file if it exists',
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
    if (!(await this.fileExists(this.encryptedFilePath))) {
      this.logger.error(
        new Error(
          `The encrypted environment variables file "${this.encryptedFilePath} does not exist"`
        )
      )
      return
    }

    if ((await this.fileExists(this.decryptedFilePath)) && !this.force) {
      this.logger.error(
        new Error(
          `A decrypted file for this environment already exist ("${this.decryptedFilePath}"). Use "--force" to overwrite it.`
        )
      )
      return
    }

    const encryption = await this.app.container.make('encryption')
    const encrypted = await fs.readFile(this.encryptedFilePath)
    const decrypted = encryption.decrypt<string>(encrypted.toString())

    if (!decrypted) {
      this.logger.error(
        new Error(
          `Error while decrypting the environment file "${this.encryptedFilePath}" make sure your "APP_KEY" is properly configured.`
        )
      )
      return
    }

    await fs.writeFile(this.decryptedFilePath, decrypted)

    this.logger.success(
      `The file "${this.encryptedFilePath}" has been successfully decrypted to "${this.decryptedFilePath}"`
    )
  }
}
