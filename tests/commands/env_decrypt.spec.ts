import { test } from '@japa/runner'
import {
  DECRYPTED_DATA,
  ENCRYPTED_DATA,
  ENCRYPTED_DATA_DIFFERENT,
  setupAce,
} from '../../test_helpers/index.js'
import EnvDecrypt from '../../commands/env_decrypt.js'

test.group('EnvDecrypt', () => {
  test('decrypt environment variables file', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    await fs.create('.env.local.encrypted', ENCRYPTED_DATA)

    const command = await ace.create(EnvDecrypt, [])
    await command.exec()

    await assert.fileContains('.env.local', DECRYPTED_DATA)

    command.assertSucceeded()
  })

  test('peacefull error when encrypted environment variables file does not exist', async ({
    assert,
    fs,
  }) => {
    const ace = await setupAce(fs.baseUrl)

    const command = await ace.create(EnvDecrypt, [])
    await command.exec()

    await assert.fileNotExists('.env.local')
    await assert.fileNotExists('.env.local.encrypted')

    command.assertSucceeded()
  })

  test('existing decrypted file is not overwritten if --force is omitted', async ({
    assert,
    fs,
  }) => {
    const ace = await setupAce(fs.baseUrl)

    await fs.create('.env.local', DECRYPTED_DATA)
    await fs.create('.env.local.encrypted', ENCRYPTED_DATA_DIFFERENT)

    const command = await ace.create(EnvDecrypt, [])
    await command.exec()

    await assert.fileEquals('.env.local', DECRYPTED_DATA)

    command.assertSucceeded()
  })

  test('existing decrypted file is overwritten if --force is defined', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    await fs.create('.env.local', 'HEY=TEST')
    await fs.create('.env.local.encrypted', ENCRYPTED_DATA)

    const command = await ace.create(EnvDecrypt, ['--force'])
    await command.exec()

    await assert.fileEquals('.env.local', DECRYPTED_DATA)

    command.assertSucceeded()
  })

  test('decrypt proper environment variable file depending on NODE_ENV', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    process.env.NODE_ENV = 'staging'

    await fs.create('.env.staging.encrypted', ENCRYPTED_DATA)

    const command = await ace.create(EnvDecrypt, [])
    await command.exec()

    await assert.fileEquals('.env.staging', DECRYPTED_DATA)

    command.assertSucceeded()
  })

  test('peacefully fail with incorrect secret', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    process.env.NODE_ENV = 'staging'

    ace.app.config.set('app.appKey', 'wrongsecretthatmustbelongenough')

    await fs.create('.env.staging.encrypted', ENCRYPTED_DATA)

    const command = await ace.create(EnvDecrypt, [])
    await command.exec()

    await assert.fileNotExists('.env.staging')

    command.assertSucceeded()
  })
})
