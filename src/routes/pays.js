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
const tableName = 'pays'  // doit correspondre à ta table « pays »

// CRUD des pays
router.post(
  '/',
  validerDonnee(['name', 'alpha3', 'numeric']),  // on attend { name, alpha3, numeric }
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
  ':id',
  validerDonnee(['name', 'alpha3', 'numeric']),
  updateByID(tableName)
)
router.delete(
  ':id',
  deleteByID(tableName)
)

export default router
