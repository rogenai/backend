import { Router } from 'express';
import { NovellaController } from './novella-controller';


const router = Router();
const controller = new NovellaController();

router.get('/', controller.getAllNovellas);
router.get('/:id', controller.getNovellaById);
router.post('/', controller.createNovella);
router.put('/:id', controller.updateNovella);
router.delete('/:id', controller.deleteNovella);

export default router;