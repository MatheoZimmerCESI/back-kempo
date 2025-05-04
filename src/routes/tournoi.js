import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Tournoi';

router.post('/tournoi', validerDonnee([ 'nom', 'lieu', 'systemeElimination', 'id_categorie', 'id_pays', 'date_debut','date_fin']), createOne(tableName));
router.get('/tournoi', getAll(tableName));
router.get('/tournoi/:id', getOneByID(tableName));
router.put('/tournoi/:id', validerDonnee(['date_fin']), updateByID(tableName));
router.delete('/tournoi/:id', deleteByID(tableName));

export default router;
