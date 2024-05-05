import path, { dirname } from 'path';

import { PrismaClient } from '@prisma/client'

import { StatusCodes } from 'http-status-codes';
import { IApiRessourceSelect } from '../../dto/api';
import { generateDocumentContracts } from '../../utils/generateFile';
import { formatDate } from '../../utils/time';
import { Request } from 'express';


export async function get_contracts(req, res) {
    const prisma = new PrismaClient()
    const limitPage = 10

    const currentPage = (req.query['page'] - 1) || 0
    const contracts = await prisma.contracts.findMany({
        where: {},
        skip: currentPage * limitPage,
        take: limitPage,
        include: {
            client: true
        }
    })

    await prisma.$disconnect()
    res.json({ message: 'Success get contracts', data: contracts });
}


export async function post_contracts(req: Request, res) {

    const prisma = new PrismaClient()
    let contracts: IApiRessourceSelect

    try {
        contracts = await create(prisma, req)
    } catch (error) {
        console.log(error)
        await prisma.$disconnect()
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: error });
    }

    const newDate = new Date()
    const nameDocument = `${contracts.numeroOpportunite}_${formatDate(newDate, '')}_${newDate.getHours()}`

    const pdfName = `/public/contrats/${nameDocument}.pdf`
    const docxName = `/public/contrats/${nameDocument}.docx`

    const pdfFile = path.join(dirname(require.main.filename), pdfName)
    const docxFile = path.join(dirname(require.main.filename), docxName)

    const successFiles = await generateDocumentContracts(contracts, pdfFile, docxFile)

    await prisma.$disconnect()
    res.json({ message: 'Success post contracts', data: { ...contracts, contratDocuments: successFiles, contrat_pdf: pdfName, contrat_docx: docxName } });
}

async function create(prisma, req): Promise<IApiRessourceSelect> {

    return await prisma.contracts.create({
        data: {
            referenceDossier: req.body['referenceDossier'],
            numeroSIRET: req.body['numeroSIRET'],
            numeroSIREN: req.body['numeroSIREN'],
            affaire: req.body['affaire'],
            intermediaire: req.body['intermediaire'],
            descriptionSuccincte: req.body['descriptionSuccincte'],
            imageLien: JSON.stringify(req.body['imageLien']),
            presenceCoassurance: req.body['presenceCoassurance'],
            adresseOperation: req.body['adresseOperation'],
            planAdresseOperation: JSON.stringify(req.body['planAdresseOperation']),
            descriptifOperation: req.body['descriptifOperation'],
            coutOperation: req.body['coutOperation'],
            client: {
                connectOrCreate: {
                    where: {
                        clientId: req.body['clientId'] || 0
                    },
                    create: {
                        genre: req.body['genre'],
                        nom: req.body['nom'],
                        prenom: req.body['prenom'],
                        rue: req.body['rue'],
                        ville: req.body['ville'],
                        codePostal: req.body['codePostal'],
                    }
                }
            }
        },
        include: {
            client: true
        }
    })
}
