import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Club';

router.post('/club', validerDonnee(['nom']), createOne(tableName));
router.get('/club', getAll(tableName));
router.get('/club/:id', getOneByID(tableName));
router.put('/club/:id', validerDonnee(['nom']), updateByID(tableName));
router.delete('/club/:id', deleteByID(tableName));

export default router;
