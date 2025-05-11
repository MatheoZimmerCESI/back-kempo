import express from 'express'
import {
  createOne,
  getAll,
  getOneByID,
  updateByID,
  deleteByID
} from '../middlewares/crud.js'
import { validerDonnee } from '../middlewares/verification.js'

const router = express.Router()
const tableName = 'grade'  // doit correspondre à ton mapping Prisma ou ta table SQL

// CRUD des grades
router.post(
  '/',
  validerDonnee(['name']),      // on attend ici { name: string }
  createOne(tableName)
)
router.get(
  '/',
  getAll(tableName)
)
router.get(
  '/:id',
  getOneByID(tableName)
)
router.put(
  '/:id',
  validerDonnee(['name']),
  updateByID(tableName)
)
router.delete(
  '/:id',
  deleteByID(tableName)
)

export default router
