import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Categorie';

router.post('/categorie', validerDonnee(['nom', 'ageMin', 'ageMax', 'poidsMin', 'poidsMax', 'sexe']), createOne(tableName));
router.get('/categorie', getAll(tableName));
router.get('/categorie/:id', getOneByID(tableName));
router.put('/categorie/:id', validerDonnee(['nom', 'ageMin', 'ageMax', 'poidsMin', 'poidsMax', 'sexe']), updateByID(tableName));
router.delete('/categorie/:id', deleteByID(tableName));

export default router;
