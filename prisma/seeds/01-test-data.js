// prisma/seeds/01-test-data.js
import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma/client.js'
import { seedCountries } from './02-countries.js'
import { seedGrades }    from './03-grades.js'

async function main() {
  // 0) TRUNCATE toutes les tables
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "match",
      "tournoi",
      "poule",
      "competiteur",
      "club",
      "categorie",
      "grade",
      "UserRole",
      "user",
      "role",
      "pays"
    RESTART IDENTITY CASCADE;
  `)

  // 1) Seed des pays
  await seedCountries()
  const allCountries = await prisma.pays.findMany({ orderBy: { id: 'asc' } })

  // 2) Seed des grades
  await seedGrades()
  const allGrades = await prisma.grade.findMany({ orderBy: { id: 'asc' } })

  // 2.5) Seed des catégories
  const categoriesData = [
    { nom: 'Poussin (10–11 ans, Mixte)', ageMin: 10, ageMax: 11, poidsMin: 0,  poidsMax: 27, sexe: 'Mixte' },
    { nom: 'Minime (12–13 ans, Mixte)',  ageMin: 12, ageMax: 13, poidsMin: 28, poidsMax: 42, sexe: 'Mixte' },
    { nom: 'Cadet (14–15 ans, Homme)',   ageMin: 14, ageMax: 15, poidsMin: 43, poidsMax: 57, sexe: 'Homme' },
    { nom: 'Cadet (14–15 ans, Femme)',   ageMin: 14, ageMax: 15, poidsMin: 43, poidsMax: 57, sexe: 'Femme' },
    { nom: 'Junior (16–17 ans, Homme)',  ageMin: 16, ageMax: 17, poidsMin: 58, poidsMax: 72, sexe: 'Homme' },
    { nom: 'Junior (16–17 ans, Femme)',  ageMin: 16, ageMax: 17, poidsMin: 58, poidsMax: 72, sexe: 'Femme' },
    { nom: 'Senior (18+ ans, Homme)',    ageMin: 18, ageMax: 99, poidsMin: 73, poidsMax: 90, sexe: 'Homme' },
    { nom: 'Senior (18+ ans, Femme)',    ageMin: 18, ageMax: 99, poidsMin: 73, poidsMax: 90, sexe: 'Femme' }
  ]
  await prisma.categorie.createMany({ data: categoriesData })
  console.log(`→ Inséré ${categoriesData.length} catégories`)

  // 3) Création des rôles
  await prisma.role.createMany({
    data: [
      { name: 'invite' },
      { name: 'user' },
      { name: 'admin' },
      { name: 'gestionnaire' }
    ]
  })

  // 4) Création des utilisateurs + hash
  const usersData = [
    { email: 'user@test.com',         plain: 'user!',        role: 'user' },
    { email: 'admin@test.com',        plain: 'admin!',       role: 'admin' },
    { email: 'gestionnaire@test.com', plain: 'gestionaire!', role: 'gestionnaire' }
  ]
  const createdUsers = []
  for (const u of usersData) {
    const hash = await bcrypt.hash(u.plain, 10)
    const user = await prisma.user.create({
      data: { email: u.email, password: hash }
    })
    createdUsers.push({ id: user.id, email: user.email, role: u.role })
    console.log(`→ User créé : ${user.email} (id=${user.id})`)
  }

  // 5) Liaison UserRole
  const userRoleEntries = []
  for (const cu of createdUsers) {
    const roleRecord = await prisma.role.findUnique({ where: { name: cu.role } })
    if (roleRecord) {
      userRoleEntries.push({ userId: cu.id, roleId: roleRecord.id })
    }
  }
  if (userRoleEntries.length) {
    await prisma.userRole.createMany({ data: userRoleEntries })
    console.log(`→ ${userRoleEntries.length} UserRole créées`)
  }

  // 6) Création des clubs
  const clubsData = [
    { name: 'Dojo Alpha' },
    { name: 'Fédération Kempo' },
    { name: 'Karate Club Paris' },
    { name: 'MMA Lyonnais' },
    { name: 'Arts Martiaux Marseille' }
  ]
  await prisma.club.createMany({ data: clubsData })
  const allClubs = await prisma.club.findMany({ orderBy: { id: 'asc' } })
  console.log(`→ ${clubsData.length} Clubs créés`)

  // 7) Création des compétiteurs (user/admin) sans lien catégorie
  const comps = []
  for (const cu of createdUsers) {
    if (cu.role === 'user' || cu.role === 'admin') {
      const comp = await prisma.competiteur.create({
        data: {
          firstname:  cu.role === 'user' ? 'Jean' : 'Alice',
          surname:    cu.role === 'user' ? 'Dupont' : 'Martin',
          birthday:   '1990-01-15',
          sex:        cu.role === 'user' ? 'M' : 'F',
          weight:     cu.role === 'user' ? 75 : 60,
          email:      cu.email,
          user:       { connect: { id: cu.id } },
          pays:       { connect: { id: allCountries[0].id } },
          club:       { connect: { id: allClubs[0].id } },
          grade:      { connect: { id: allGrades[0].id } }
        }
      })
      comps.push(comp.id)
      console.log(`→ Compétiteur créé pour ${cu.email} (id=${comp.id})`)
    }
  }

  // 8) Création de 2 tournois avec catégorie & pays
  const allCategories = await prisma.categorie.findMany({ orderBy: { id: 'asc' } })
  const t1 = await prisma.tournoi.create({
    data: {
      nom:                'KempoParis',
      lieu:               'Paris – Dojo Central Sports',
      systemeElimination: 'Elimination Directe',
      dateDebut:          '2025-06-01',
      dateFin:            '2025-06-02',
      categorieId:        allCategories.find(c => c.nom.startsWith('Poussin'))?.id,
      countryId:          allCountries.find(c => c.name === 'France')?.id
    }
  })
  const t2 = await prisma.tournoi.create({
    data: {
      nom:                'KempoLyon',
      lieu:               'Lyon – Salle Omnisports Gerland',
      systemeElimination: 'Poules',
      dateDebut:          '2025-07-10',
      dateFin:            '2025-07-11',
      categorieId:        allCategories.find(c => c.nom.startsWith('Junior'))?.id,
      countryId:          allCountries.find(c => c.name === 'France')?.id
    }
  })
  console.log(`→ Tournois créés : ${t1.id} (${t1.nom}), ${t2.id} (${t2.nom})`)

  // 9) Création de 5 matchs
  const matchEntries = [
    {
      tournoiId:           t1.id,
      competitor1Id:       comps[0],
      competitor2Id:       comps[1],
      score1:              5,
      score2:              3,
      keikokuCompetiteur1: 0,
      keikokuCompetiteur2: 1,
      isFinished:          true
    },
    {
      tournoiId:           t1.id,
      competitor1Id:       comps[1],
      competitor2Id:       comps[0],
      score1:              2,
      score2:              4,
      keikokuCompetiteur1: 2,
      keikokuCompetiteur2: 0,
      isFinished:          true
    },
    {
      tournoiId:           t1.id,
      competitor1Id:       comps[0],
      competitor2Id:       comps[1],
      score1:              3,
      score2:              3,
      keikokuCompetiteur1: 1,
      keikokuCompetiteur2: 1,
      isFinished:          true
    },
    {
      tournoiId:           t2.id,
      competitor1Id:       comps[0],
      competitor2Id:       comps[1],
      score1:              6,
      score2:              2,
      keikokuCompetiteur1: 0,
      keikokuCompetiteur2: 0,
      isFinished:          true
    },
    {
      tournoiId:           t2.id,
      competitor1Id:       comps[1],
      competitor2Id:       comps[0],
      score1:              1,
      score2:              5,
      keikokuCompetiteur1: 3,
      keikokuCompetiteur2: 0,
      isFinished:          true
    }
  ]
  await prisma.match.createMany({ data: matchEntries })
  console.log('→ 5 matchs créés')

  console.log('✅ Seed complet exécuté avec succès !')
}

main()
  .catch(e => {
    console.error('❌ Erreur pendant les seeds', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
