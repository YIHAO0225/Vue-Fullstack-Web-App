import * as favouritesController from '../controllers/favourites.controller.js';
import express from 'express';

const router = express.Router()

//Get admin by id
router.get("/:id",favouritesController.findOne);

//add new character By user_id and character
router.post("/update",favouritesController.updateFavouriteById)
export default router;