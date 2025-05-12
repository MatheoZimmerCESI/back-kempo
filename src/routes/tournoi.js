// src/routes/tournoi.js
import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js'
import { validerDonnee } from '../middlewares/verification.js'

const router = express.Router()
const tableName = 'tournoi'  // doit être le nom physique en minuscules

// 1) Toutes les routes sont relatives :
//    GET  /tournoi        → liste de tous les tournois
//    GET  /tournoi/:id    → un tournoi par ID
//    POST /tournoi        → création (admin/gestionnaire)
//    PUT  /tournoi/:id    → mise à jour (admin/gestionnaire)
//    DELETE /tournoi/:id  → suppression (admin/gestionnaire)

// Récupérer tous les tournois (lecture libre)
router.get('/', getAll(tableName))

// Récupérer un tournoi par son ID (lecture libre)
router.get('/:id', getOneByID(tableName))

// Créer un nouveau tournoi (seulement admin & gestionnaire)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'gestionnaire']),
  validerDonnee([
    'nom',
    'lieu',
    'systemeElimination',
    'categorieId',
    'countryId',
    'dateDebut',
    'dateFin'
  ]),
  createOne(tableName)
)

// Mettre à jour un tournoi existant (seulement admin & gestionnaire)
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'gestionnaire']),
  validerDonnee([
    'nom',
    'lieu',
    'systemeElimination',
    'categorieId',
    'countryId',
    'dateDebut',
    'dateFin'
  ]),
  updateByID(tableName)
)

// Supprimer un tournoi (seulement admin & gestionnaire)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'gestionnaire']),
  deleteByID(tableName)
)

export default router
