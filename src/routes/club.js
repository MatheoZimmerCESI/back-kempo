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
const tableName = 'club'  // doit correspondre à ta table « club »

// CRUD des clubs
router.post(
  '/',
  validerDonnee(['name']),  // on attend { name: string }
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
