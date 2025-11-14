import * as contributionsController from '../controllers/contributions.controller.js';
import express from 'express';

const router = express.Router()

//Get admin by id
router.get("/:id",contributionsController.findOne);

// get all contributions
router.get("/",contributionsController.findAll);


router.post('/', contributionsController.appendOne);

router.delete('/:id', contributionsController.deleteOne);

//Get Addcharacter conotribution by user_id
router.get('/characters/:id',contributionsController.findAddCharacterByUser);

//approve or reject contribution
router.patch('/:id', contributionsController.editOne);

//Get contributions sort by data.id and date
router.get("/history/date",contributionsController.history);
export default router;