// src/routes/club.js
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
const tableName = 'Club'

// Routes CRUD « relatives »
router.get('/',        getAll(tableName))
router.get('/:id',     getOneByID(tableName))
router.post('/',       validerDonnee(['nom']), createOne(tableName))
router.put('/:id',     validerDonnee(['nom']), updateByID(tableName))
router.delete('/:id',  deleteByID(tableName))

export default router
