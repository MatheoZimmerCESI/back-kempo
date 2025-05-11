// scripts/purge-deleted-users.js
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  // Calcul de la date seuil (7 jours avant maintenant)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // 1. Supprimer les Competiteur supprimés (soft-delete) depuis plus de 7 jours
  const deletedComps = await prisma.competiteur.deleteMany({
    where: {
      deletedAt: { lt: sevenDaysAgo }
    }
  })
  console.log(`→ Competiteur soft-deleted older than 7d purged: ${deletedComps.count}`)

  // 2. Supprimer les users soft-deleted depuis plus de 7 jours
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      deletedAt: { lt: sevenDaysAgo }
    }
  })
  console.log(`→ Users soft-deleted older than 7d purged: ${deletedUsers.count}`)

  // 3. (Optionnel) Supprimer les PasswordReset expirés
  const expiredResets = await prisma.passwordReset.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
  console.log(`→ PasswordReset expired purged: ${expiredResets.count}`)

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Error during purge:', e)
    process.exit(1)
  })
