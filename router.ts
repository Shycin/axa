import { Router } from 'express';
const router = Router();

import contractRoutes from './src/routes/contract';
import clientRoutes from './src/routes/client';


router.use("/contracts", contractRoutes);
router.use("/clients", clientRoutes);

export default router;