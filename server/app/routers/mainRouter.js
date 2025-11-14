import express from 'express';
import adminlistRouter from './adminlist.routes.js';
import charactersRouter from './characters.routes.js';
import contributionsRouter from './contributions.routes.js';
import favouritesRouter from './favourites.routes.js';
import usersRouter from './users.routes.js';
import sessionsRouter from './sessions.routes.js';

const router = express.Router();

// 合并 adminlistRouter 中的路由
router.use('/v1/adminlist', adminlistRouter);
router.use('/v1/characters', charactersRouter);
router.use('/v1/contributions', contributionsRouter);
router.use('/v1/favourites', favouritesRouter);
router.use('/v1/users', usersRouter);
router.use('/v1/sessions', sessionsRouter);

export default router;
