import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Poule';

router.post('/poule', validerDonnee(['id_tournoi']), createOne(tableName));
router.get('/poule', getAll(tableName));
router.get('/poule/:id', getOneByID(tableName));
router.put('/poule/:id', validerDonnee(['id_tournoi']), updateByID(tableName));
router.delete('/poule/:id', deleteByID(tableName));

export default router;
