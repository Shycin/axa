import { PrismaClient } from '@prisma/client'


export async function get_clients(req: Request, res) {
    const prisma = new PrismaClient()

    let searchConditions = {};
    if (req.body['name']) {
        searchConditions = { OR: [] }
        const splitName = req.body['name'].split(' ')

        if (splitName.length > 1) {
            searchConditions['OR'].push(
                {
                    AND: [
                        {
                            nom: {
                                contains: splitName[0]
                            }
                        },
                        {
                            prenom: {
                                contains: splitName[1]
                            }
                        }
                    ]
                }
            )

            searchConditions['OR'].push(
                {
                    AND: [
                        {
                            nom: {
                                contains: splitName[1]
                            }
                        },
                        {
                            prenom: {
                                contains: splitName[0]
                            }
                        }
                    ]
                }
            )
        }
        else {
            searchConditions['OR'].push(
                {
                    OR: [
                        {
                            nom: {
                                contains: splitName[0]
                            }
                        },
                        {
                            prenom: {
                                contains: splitName[0]
                            }
                        }
                    ]
                }
            )
        }

    }

    const clients = await prisma.client.findMany({
        where: searchConditions,
    })


    await prisma.$disconnect()
    res.json({ message: 'Success get clients', data: clients });
}