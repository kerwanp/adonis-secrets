import { AceFactory } from '@adonisjs/core/factories'

export const DECRYPTED_DATA = 'HELLO=WORLD'
export const ENCRYPTED_DATA =
  'BNc8hvzM9qjOltBI-al8cqOWesWcAQwgThpQTts36YI.YWRrcEVhVGVDc1RRLXl3UQ.hpcBht3JTe7H_zN3Y-cZTHNTETV_RJH1xRfrIs13FHs'
export const ENCRYPTED_DATA_DIFFERENT =
  'JtM9Jy_qMEtefDs0kwz1S8KZvck77zbui6f-6yMRxps.YjJDbGN1VFFQTUQwZmp5QQ.H_WbO7Fjn7RMAB1dN3C3xzSU7IzwDBqCvnXfUxP67tA'

export async function setupAce(baseUrl: URL) {
  process.env.NODE_ENV = 'development'

  const ace = await new AceFactory().make(baseUrl, { importer: () => {} })

  await ace.app.init()
  await ace.app.boot()

  ace.app.config.set('app.appKey', 'mylongsecretbecauseminimum32characters')

  // ace.app.container.swap(Encryption, () => {
  //   return new Encryption({ secret: 'mylongsecretbecauseminimum32characters' })
  // })

  return ace
}
