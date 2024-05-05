import express from 'express';
import multer from 'multer';
import path, { dirname } from 'path'
import crypto from 'crypto';

import { get_contracts, post_contracts } from './controller/contract';
import { validateData } from '../middleware/validationMiddleware';
import { contractSearchSchema, contratRegistrationSchema } from '../schemas/contracts';
import { validateDataFiles } from '../middleware/validationFilesMiddleware';
import { validateDataGet } from '../middleware/validationMiddlewareGet';


const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    // "image/webp",
];



const fileFilter = (req, file, cb) => {
    if (ACCEPTED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        //rejects storing a file
        cb(null, false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(dirname(require.main.filename), './public/uploads/'))
    },
    filename: function (req, file, cb) {
        const fileuuid = crypto.randomUUID();

        cb(null, Date.now() + '-' + fileuuid + '.jpeg');
    }
})

const upload = multer({
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter,
    storage: storage
});





const Router = express.Router()
Router.get('/', validateDataGet(contractSearchSchema), get_contracts);






Router.post('/', [
    upload.fields([{ name: 'planAdresseOperation' }, { name: 'imageLien', maxCount: 1 }]),
    validateDataFiles(["planAdresseOperation", "imageLien"]),
    validateData(contratRegistrationSchema)
], post_contracts);





export default Router;