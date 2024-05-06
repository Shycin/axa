import path, { dirname } from 'path';
import { promisify } from 'util'
import fs from 'fs'

import { PrismaClient } from '@prisma/client'

import { StatusCodes } from 'http-status-codes';
import { IApiRessourceSelect } from '../../dto/api';
import { generateDocumentContracts } from '../../utils/generateFile';
import { formatDate } from '../../utils/time';
import { Request } from 'express';



const unlinkAsync = promisify(fs.unlink)


export async function get_contracts(req, res) {
    const prisma = new PrismaClient()
    const limitPage = 10

    const currentPage = (req.query['page'] - 1) || 0

    const orderby = []
    if (req.query['client']) {
        orderby.push({
            client: {
                nom: req.query['client'],
            }
        })
    }
    if (req.query['referenceDossier']) {
        orderby.push({ referenceDossier: req.query['referenceDossier'] })
    }
    if (req.query['numeroOpportunite']) {
        orderby.push({ numeroOpportunite: req.query['numeroOpportunite'] })
    }


    const whereClause = {}
    if (req.query['nameSearch']) {
        whereClause['client'] = {
            OR: [
                { nom: { contains: req.query['nameSearch'] } },
                { prenom: { contains: req.query['nameSearch'] } }
            ]
        }
    }
    if (req.query['referenceDossierSearch']) {
        whereClause['referenceDossier'] = { contains: req.query['referenceDossierSearch'] }
    }
    if (req.query['numeroOpportuniteSearch']) {
        whereClause['numeroOpportunite'] = { contains: req.query['numeroOpportuniteSearch'] }
    }

    const contracts = await prisma.$transaction([
        prisma.contracts.count({
            where: { ...whereClause },
            orderBy: [
                ...orderby,
                { date: req.query['date'] || 'desc' }
            ],
        }),
        prisma.contracts.findMany({
            where: { ...whereClause },
            orderBy: [
                ...orderby,
                { date: req.query['date'] || 'desc' }
            ],
            skip: currentPage * limitPage,
            take: limitPage,
            include: {
                client: true,
            },
        })
    ])

    await prisma.$disconnect()
    res.json({ message: 'Success get contracts', data: contracts[1], count: contracts[0] });
}


export async function post_contracts(req: Request, res) {

    const prisma = new PrismaClient()
    let contracts: IApiRessourceSelect

    const newDate = new Date()
    const nameDocument = `${req.body['numeroOpportunite']}_${formatDate(newDate, '')}_${newDate.getHours()}`

    const pdfName = `/public/contrats/${nameDocument}.pdf`
    const docxName = `/public/contrats/${nameDocument}.docx`

    try {
        contracts = await create(prisma, req, pdfName, docxName)
    } catch (error) {
        console.log(error)

        for (const file of req.body['imageLien']) {
            await unlinkAsync(path.join(dirname(require.main.filename), './public/uploads/' + file))
        }

        for (const file of req.body['planAdresseOperation']) {
            await unlinkAsync(path.join(dirname(require.main.filename), './public/uploads/' + file))
        }

        await prisma.$disconnect()
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: error.meta.target });
    }

    const pdfFile = path.join(dirname(require.main.filename), pdfName)
    const docxFile = path.join(dirname(require.main.filename), docxName)

    const successFiles = await generateDocumentContracts(contracts, pdfFile, docxFile)

    await prisma.$disconnect()
    res.json({ message: 'Success post contracts', data: contracts, successFiles: successFiles });
}

async function create(prisma, req, pdfName, docxName): Promise<IApiRessourceSelect> {

    return await prisma.contracts.create({
        data: {
            numeroOpportunite: req.body['numeroOpportunite'],
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
            pdfFileUrl: pdfName,
            docxFileUrl: docxName,
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
