import * as charactersController from '../controllers/characters.controller.js';
import express from 'express';

const router = express.Router()

//Get admin by id
router.get("/:id",charactersController.findOne);

//Get all characters
router.get("/",charactersController.find);

//deleteCharacter By id
router.delete("/:id",charactersController.deleteOneByid);

//restoreCharacter By id
router.patch("/:id",charactersController.RestoreOneByid);

// router.patch("/", charactersController.modifyOneById);

router.post("/", charactersController.appendOne);
export default router;