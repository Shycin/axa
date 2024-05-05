import express from 'express';

import { get_clients } from './controller/client';
import { validateData } from '../middleware/validationMiddleware';
import { clientSearchSchema } from '../schemas/contracts';




const Router = express.Router()
Router.post('/', validateData(clientSearchSchema), get_clients);







export default Router;