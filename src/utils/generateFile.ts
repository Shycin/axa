import path, { dirname } from 'path';
import { IApiRessourceCreate, IApiRessourceSelect } from '../dto/api';
import { createContract } from './pdfGenerator';
import { convertPDF_DOCX } from './converterFile';

export async function generateDocumentContracts(contract: IApiRessourceSelect, pdfFile: string, docxFile: string) {
    return new Promise(async function (resolve, reject) {

        const successPDF = await createContract(contract, pdfFile)
        const successDOCX = await convertPDF_DOCX(pdfFile, docxFile)

        if (successPDF && successDOCX) {
            console.log("all File created")
            resolve(true);
        }

        resolve(false);
    });
}