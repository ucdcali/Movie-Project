import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

router.get('/', movieController.home);
router.post('/lookup', movieController.lookup);
router.post('/watchMovie', movieController.watch);
router.post('/watchAgain', movieController.watchAgain);
router.post('/delete', movieController.deleteMovie);
router.get('/sort', movieController.sortMovies);
router.get('/displayMovie', movieController.lookup);


export default router;
