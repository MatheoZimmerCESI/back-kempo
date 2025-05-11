// prisma/seeds/02-countries.js
import prisma from '../../src/prisma/client.js'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

export async function seedCountries() {
  // 1) Charge le JSON à la volée
  const __filename = fileURLToPath(import.meta.url)
  const __dirname  = dirname(__filename)
  const jsonPath   = resolve(__dirname, './countries.json')
  const raw         = await readFile(jsonPath, 'utf-8')
  const countries   = JSON.parse(raw)

  // 2) Vide la table Pays (dev only)
  await prisma.pays.deleteMany()
  console.log('→ Table pays vidée')

  // 3) Prépare et insère en batch
  const data = countries.map(c => ({
    name:    c.name,
    alpha3:  c.alpha3,
    numeric: c.numeric
  }))

  await prisma.pays.createMany({ data })
  console.log(`→ Inséré ${data.length} pays`)
}
