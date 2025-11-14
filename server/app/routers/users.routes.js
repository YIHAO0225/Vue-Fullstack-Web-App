    import * as usersController from '../controllers/users.controller.js';
import express from 'express';

    import * as logController from "../controllers/log.controller.js";

const router = express.Router()

//Get admin by id
router.get("/:id",usersController.findOne);

// Get one user's favourites
router.get("/:user_id/favourites", usersController.findFavourites);

// Get one user's contributions
router.get("/:user_id/contributions", usersController.findContributions);


router.post("/", logController.signup);

//Find all userinfo
router.get("/",usersController.findall);
export default router;