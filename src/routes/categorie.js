import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'categorie';

router.post('/', validerDonnee(['nom', 'ageMin', 'ageMax', 'poidsMin', 'poidsMax', 'sexe']), createOne(tableName));
router.get('/', getAll(tableName));
router.get('/:id', getOneByID(tableName));
router.put('/:id', validerDonnee(['nom', 'ageMin', 'ageMax', 'poidsMin', 'poidsMax', 'sexe']), updateByID(tableName));
router.delete('/:id', deleteByID(tableName));

export default router;
