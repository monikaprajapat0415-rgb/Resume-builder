// The "route" layer: only maps URLs to controller functions.
import { Router } from 'express';

export function bookRoutes(controller) {
  const router = Router();
  router.get('/', controller.list);
  router.post('/', controller.create);
  router.get('/:id', controller.get);
  router.delete('/:id', controller.remove);
  return router;
}
