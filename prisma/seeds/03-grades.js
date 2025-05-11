// prisma/seeds/03-grades.js
import prisma from '../../src/prisma/client.js'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

export async function seedGrades() {
  // 1) Lire le JSON
  const __filename = fileURLToPath(import.meta.url)
  const __dirname  = dirname(__filename)
  const jsonPath   = resolve(__dirname, './grades.json')
  const raw        = await readFile(jsonPath, 'utf-8')
  const grades     = JSON.parse(raw)

  // 2) Vider la table grade
  await prisma.grade.deleteMany()
  console.log('→ Table grade vidée')

  // 3) Insérer en batch
  await prisma.grade.createMany({ data: grades })
  console.log(`→ Inséré ${grades.length} grades`)
}
