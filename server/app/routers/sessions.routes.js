import * as logController from '../controllers/log.controller.js';

import express from 'express';

const router = express.Router()

router.post("/", logController.login);

export default router;