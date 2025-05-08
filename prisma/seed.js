// prisma/seed.js
import bcrypt from 'bcryptjs'
import prisma from '../src/prisma/client.js'

async function main() {
  // 0) Vider toutes les tables et reset des séquences (DEV only)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "match",
      "tournoi",
      "competiteur",
      "club",
      "UserRole",
      "user",
      "Role"
    RESTART IDENTITY CASCADE;
  `)

  // 1) Création des rôles
  await prisma.role.createMany({
    data: [
      { name: 'invite' },
      { name: 'user' },
      { name: 'admin' },
      { name: 'gestionnaire' }
    ]
  })

  // 2) Création des utilisateurs + hash des mots de passe
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

  // 3) Liaison UserRole
  const userRoleEntries = []
  for (const cu of createdUsers) {
    const role = await prisma.role.findUnique({ where: { name: cu.role } })
    if (role) {
      userRoleEntries.push({ userId: cu.id, roleId: role.id })
    }
  }
  await prisma.userRole.createMany({ data: userRoleEntries })
  console.log(`→ ${userRoleEntries.length} UserRole créées`)

  // 4) Création des clubs (5 exemples)
  const clubsData = [
    { name: 'Dojo Alpha' },
    { name: 'Fédération Kempo' },
    { name: 'Karate Club Paris' },
    { name: 'MMA Lyonnais' },
    { name: 'Arts Martiaux Marseille' }
  ]
  await prisma.club.createMany({ data: clubsData })
  console.log
(`→ ${clubsData.length} Clubs créés`)

  // 5) Création des compétiteurs liés aux users “user” et “admin”
  const comps = []
  for (const cu of createdUsers) {
    if (cu.role === 'user' || cu.role === 'admin') {
      const comp = await prisma.competiteur.create({
        data: {
          firstname: cu.role === 'user' ? 'Jean' : 'Alice',
          surname:   cu.role === 'user' ? 'Dupont' : 'Martin',
          birthday:  '1990-01-15',
          sex:       cu.role === 'user' ? 'M' : 'F',
          weight:    cu.role === 'user' ? 75 : 60,
          email:     cu.email,
          userId:    cu.id
        }
      })
      comps.push(comp.id)
      console.log(`→ Compétiteur créé pour ${cu.email} (id=${comp.id})`)
    }
  }

  // 6) Création de 2 tournois
  const t1 = await prisma.tournoi.create({
    data: {
      nom: 'KempoParis',
      lieu: 'Paris',
      systemeElimination: 'simple',
      date_debut: '2025-06-01',
      date_fin:   '2025-06-02'
    }
  })
  const t2 = await prisma.tournoi.create({
    data: {
      nom: 'KempoLyon',
      lieu: 'Lyon',
      systemeElimination: 'double',
      date_debut: '2025-07-10',
      date_fin:   '2025-07-11'
    }
  })
  console.log(`→ Tournois créés : ${t1.id}, ${t2.id}`)

  // 7) Création de 5 matchs
  const matchEntries = [
    // 3 matchs pour KempoParis
    { id_tournoi: t1.id, id_competiteur1: comps[0], id_competiteur2: comps[1], score1: 5, score2: 3, keikoku_competiteur1: 0, keikoku_competiteur2: 1, is_finished: true },
    { id_tournoi: t1.id, id_competiteur1: comps[1], id_competiteur2: comps[0], score1: 2, score2: 4, keikoku_competiteur1: 2, keikoku_competiteur2: 0, is_finished: true },
    { id_tournoi: t1.id, id_competiteur1: comps[0], id_competiteur2: comps[1], score1: 3, score2: 3, keikoku_competiteur1: 1, keikoku_competiteur2: 1, is_finished: true },
    // 2 matchs pour KempoLyon
    { id_tournoi: t2.id, id_competiteur1: comps[0], id_competiteur2: comps[1], score1: 6, score2: 2, keikoku_competiteur1: 0, keikoku_competiteur2: 0, is_finished: true },
    { id_tournoi: t2.id, id_competiteur1: comps[1], id_competiteur2: comps[0], score1: 1, score2: 5, keikoku_competiteur1: 3, keikoku_competiteur2: 0, is_finished: true }
  ]
  await prisma.match.createMany({ data: matchEntries })
  console.log('→ 5 matchs créés')

  console.log('✅ Seed terminé avec succès !')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
