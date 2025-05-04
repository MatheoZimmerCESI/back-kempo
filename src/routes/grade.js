import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Grade';

router.post('/grade', validerDonnee(['nom', 'couleur_ceinture']), createOne(tableName));
router.get('/grade', getAll(tableName));
router.get('/grade/:id', getOneByID(tableName));
router.put('/grade/:id', validerDonnee(['nom', 'couleur_ceinture']), updateByID(tableName));
router.delete('/grade/:id', deleteByID(tableName));

export default router;
