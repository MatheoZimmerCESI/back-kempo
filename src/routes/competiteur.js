import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Competiteur';

router.post('/competiteur', validerDonnee(['firstname', 'surname', 'birthday', 'sex', 'weight', 'id_club', 'id_country', 'id_grade']), createOne(tableName));
router.get('/competiteur', getAll(tableName));
router.get('/competiteur/:id', getOneByID(tableName));
router.put('/competiteur/:id', validerDonnee(['firstname', 'surname', 'birthday', 'sex', 'weight', 'id_club', 'id_country', 'id_grade']), updateByID(tableName));
router.delete('/competiteur/:id', deleteByID(tableName));

export default router;
