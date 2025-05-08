// src/routes/competiteur.js
import express from 'express'
import prisma from '../prisma/client.js'
import { authenticate } from '../middlewares/auth.js'
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js'
import { validerDonnee } from '../middlewares/verification.js'

const router = express.Router()
const table = 'competiteur'

// 1) Profil du compétiteur connecté (upsert ou find)
router.get(
  '/mon-profil',
  authenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId ?? req.user.id
      const comp = await prisma.competiteur.findUnique({
        where: { userId },
        include: { Club: true, Pays: true, Grade: true }
      })
      if (!comp) {
        return res.status(404).json({ message: 'Pas de profil compétiteur lié.' })
      }
      res.json(comp)
    } catch (err) {
      next(err)
    }
  }
)

// 2) Matchs du compétiteur connecté
router.get(
  '/mes-matchs',
  authenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId
      const comp = await prisma.competiteur.findUnique({
        where: { userId },
        select: { id: true }
      })
      if (!comp) {
        return res.status(404).json({ message: 'Pas de profil compétiteur lié.' })
      }
      const matchs = await prisma.match.findMany({
        where: {
          OR: [
            { id_competiteur1: comp.id },
            { id_competiteur2: comp.id }
          ]
        }
      })
      res.json(matchs)
    } catch (err) {
      next(err)
    }
  }
)

// 3) CRUD générique
router.post(
  '/',
  validerDonnee(['firstname','surname','birthday','sex','weight','id_club','id_country','id_grade']),
  createOne(table)
)
router.get('/', getAll(table))
router.get('/:id', getOneByID(table))
router.put(
  '/:id',
  validerDonnee(['firstname','surname','birthday','sex','weight','id_club','id_country','id_grade']),
  updateByID(table)
)
router.delete('/:id', deleteByID(table))

export default router
