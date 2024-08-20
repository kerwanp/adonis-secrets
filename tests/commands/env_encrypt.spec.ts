import { test } from '@japa/runner'
import EnvEncrypt from '../../commands/env_encrypt.js'
import { DECRYPTED_DATA, ENCRYPTED_DATA, setupAce } from '../../test_helpers/index.js'

test.group('EnvEncrypt', () => {
  test('encrypt environment variables file', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    await fs.create('.env.local', 'HELLO=WORLD')

    const command = await ace.create(EnvEncrypt, [])
    await command.exec()

    await assert.fileExists('.env.local.encrypted')
    await assert.fileNotContains('.env.local.encrypted', await fs.contents('.env.local'))

    command.assertSucceeded()
  })

  test('peacefull error when environment variables file does not exist', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    const command = await ace.create(EnvEncrypt, [])
    await command.exec()

    await assert.fileNotExists('.env.local')
    await assert.fileNotExists('.env.local.encrypted')

    command.assertSucceeded()
  })

  test('existing encrypted file is not overwritten if --force is omitted', async ({
    assert,
    fs,
  }) => {
    const ace = await setupAce(fs.baseUrl)

    await fs.create('.env.local', DECRYPTED_DATA)
    await fs.create('.env.local.encrypted', 'ialreadyexist')

    const command = await ace.create(EnvEncrypt, [])
    await command.exec()

    await assert.fileEquals('.env.local.encrypted', 'ialreadyexist')

    command.assertSucceeded()
  })

  test('existing encrypted file is overwritten if --force is defined', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    await fs.create('.env.local', DECRYPTED_DATA)
    await fs.create('.env.local.encrypted', 'ialreadyexist')

    const command = await ace.create(EnvEncrypt, ['--force'])
    await command.exec()

    await assert.fileNotContains('.env.local.encrypted', 'ialreadyexist')

    command.assertSucceeded()
  })

  test('encrypt proper environment variable file depending on NODE_ENV', async ({ assert, fs }) => {
    const ace = await setupAce(fs.baseUrl)

    process.env.NODE_ENV = 'staging'

    await fs.create('.env.staging', ENCRYPTED_DATA)

    const command = await ace.create(EnvEncrypt, [])
    await command.exec()

    await assert.fileExists('.env.staging.encrypted')
    await assert.fileNotContains('.env.staging.encrypted', await fs.contents('.env.staging'))

    command.assertSucceeded()
  })
})
