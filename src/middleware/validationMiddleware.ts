import path, { dirname } from 'path';
import { promisify } from 'util'
import fs from 'fs'


import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from "zod"
import { StatusCodes } from "http-status-codes"

const unlinkAsync = promisify(fs.unlink)

export function validateData(schema: z.ZodObject<any, any>) {
    //return (req: Request, res: Response, next: NextFunction) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            req.body = schema.parse(req.body);
            next();
        } catch (error) {

            if (req.body['imageLien']) {
                for (const file of req.body['imageLien']) {
                    await unlinkAsync(path.join(dirname(require.main.filename), './public/uploads/' + file))
                }
            }

            if (req.body['planAdresseOperation']) {
                for (const file of req.body['planAdresseOperation']) {
                    await unlinkAsync(path.join(dirname(require.main.filename), './public/uploads/' + file))
                }
            }

            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    [issue.path.join('.')]: `${issue.message}`,
                }))
                res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}