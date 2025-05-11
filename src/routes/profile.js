// src/routes/profile.js
import express from 'express'
import prisma from '../prisma/client.js'
import { authenticate } from '../middlewares/auth.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// GET /profile → Récupère le profil complet
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id:         true,
        email:      true,
        createdAt:  true,
        updatedAt:  true,
        competiteur: {
          select: {
            id:         true,
            firstname:  true,
            surname:    true,
            birthday:   true,
            sex:        true,
            weight:     true,
            countryId:  true,
            clubId:     true,
            gradeId:    true,
            pays: {
              select: { id: true, name: true }
            },
            club: {
              select: { id: true, name: true }
            },
            grade: {
              select: { id: true, name: true }
            }
          }
        },
        userRoles: {
          select: {
            role: {
              select: { name: true }
            }
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    const roles = user.userRoles.map(ur => ur.role.name)

    res.json({
      id:          user.id,
      email:       user.email,
      createdAt:   user.createdAt,
      updatedAt:   user.updatedAt,
      competiteur: user.competiteur,
      roles
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /profile → Met à jour le profil compétiteur
router.patch('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId
    const {
      firstname,
      surname,
      birthday,
      sex,
      weight,
      countryId,
      clubId,
      gradeId
    } = req.body

    const result = await prisma.competiteur.updateMany({
      where: { userId },
      data: {
        firstname,
        surname,
        birthday,
        sex,
        weight,
        countryId,
        clubId,
        gradeId
      }
    })

    if (result.count === 0) {
      return res.status(404).json({ message: 'Profil compétiteur non trouvé' })
    }

    res.json({ message: 'Profil mis à jour avec succès' })
  } catch (err) {
    next(err)
  }
})


// 3) Désactiver son compte
// PATCH /profile/deactivate
router.patch(
  '/deactivate',
  authenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId

      // On ne change que isActive, pas deletedAt
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      })

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)

// 4) Supprimer définitivement son compte
// DELETE /profile — soft-delete + soft-deactivate
router.delete(
  '/',
  authenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId

      // 1) Mettre isActive à false ET supprimer à date now()
      await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deletedAt: new Date()
        }
      })

      // 2) (Optionnel) cascade sur Competiteur
      await prisma.competiteur.updateMany({
        where: { userId },
        data: { deletedAt: new Date() }
      })

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)

// PATCH /profile/reactivate
router.patch(
  '/reactivate',
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      // 1) Récupère l’utilisateur (même si isActive=false)
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, password: true, deletedAt: true }
      })
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides' })
      }
      if (user.deletedAt) {
        return res.status(403).json({ message: 'Compte supprimé' })
      }

      // 2) Vérifie le mot de passe
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) {
        return res.status(401).json({ message: 'Identifiants invalides' })
      }

      // 3) Réactive le compte
      await prisma.user.update({
        where: { id: user.id },
        data: { isActive: true, deletedAt: null }
      })
      await prisma.competiteur.updateMany({
        where: { userId: user.id },
        data: { deletedAt: null }
      })

      return res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)


export default router