import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from "zod"
import { StatusCodes } from "http-status-codes"

export function validateDataFiles(fieldFiles: string[]) {
    //return (req: Request, res: Response, next: NextFunction) => {
    return (req: any, res: Response, next: NextFunction) => {
        try {
            const filesError = { errors: [] }
            fieldFiles.forEach((file) => !req.files[file] && filesError.errors.push({ path: [file], message: "Image Required" }))

            if (!filesError.errors.length) {

                fieldFiles.forEach((file) => req.body[file] = req.files[file].map((propertyFile) => propertyFile.filename))

                next();
            }
            else {
                throw (filesError)
            }

        } catch (error) {
            if (error) {
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