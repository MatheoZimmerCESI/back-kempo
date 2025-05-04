import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Pays';

router.post('/pays', validerDonnee(['countryName', 'alpha3', 'numeric']), createOne(tableName));
router.get('/pays', getAll(tableName));
router.get('/pays/:id', getOneByID(tableName));
router.put('/pays/:id', validerDonnee(['countryName', 'alpha3', 'numeric']), updateByID(tableName));
router.delete('/pays/:id', deleteByID(tableName));

export default router;
