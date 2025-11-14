import * as adminlistController from '../controllers/adminlist.controller.js';
import express from 'express';

const router = express.Router()

//Get admin by id
router.get("/:id",adminlistController.findOne);

//Add a user to adminlist
router.post("/:id",adminlistController.appendOne);

//Delete a adminstator 
router.post("/delete/:id",adminlistController.DeleteOne);
export default router;