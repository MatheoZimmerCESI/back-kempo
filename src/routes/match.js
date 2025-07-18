import express from 'express';
import { createOne, getAll, getOneByID, updateByID, deleteByID } from '../middlewares/crud.js';
import { validerDonnee } from '../middlewares/verification.js';

const router = express.Router();
const tableName = 'Match';

router.post('/', validerDonnee(['id_tournoi', 'id_competiteur1', 'id_competiteur2']), createOne(tableName));
router.get('/', getAll(tableName));
router.get('/:id', getOneByID(tableName));
router.put(':id', validerDonnee(['id_tournoi', 'id_competiteur1', 'id_competiteur2', 'score1', 'score2',
                                        'keikoku_competiteur1' , 'keikoku_competiteur2' , 'is_finished']), updateByID(tableName));
                                        
router.patch(':id/score', validerDonnee(['score1', 'score2', 'keikoku_competiteur1' , 'keikoku_competiteur2' , 'is_finished']), updateByID(tableName));
router.delete('/:id', deleteByID(tableName));

export default router;
