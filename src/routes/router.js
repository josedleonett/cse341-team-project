import { Router } from 'express';
import apiRoutes from './api-routes.js';
import ejsRoutes from './ejs-routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get('/api-docs.json', (req, res) => res.status(200).json(swaggerSpec));
router.use('/api', apiRoutes);
router.use('/', ejsRoutes);

export default router;