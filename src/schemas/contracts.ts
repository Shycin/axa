const { z } = require('zod')


export const contratRegistrationSchema = z.object({
    numeroOpportunite: z.string().max(255),
    referenceDossier: z.string().max(255),
    numeroSIRET: z.string().min(14).max(14),
    numeroSIREN: z.string().min(9).max(9),
    affaire: z.string().max(255),

    clientId: z.coerce.number().nullish(),
    genre: z.string().regex(/[HF]/),
    nom: z.string().max(255),
    prenom: z.string().max(255),
    rue: z.string().max(255),
    ville: z.string().max(255),
    codePostal: z.string().min(5).max(5),

    intermediaire: z.string().max(255),
    descriptionSuccincte: z.string(),
    presenceCoassurance: z.coerce.boolean(),
    adresseOperation: z.string().max(255),
    descriptifOperation: z.string(),
    coutOperation: z.coerce.number().nonnegative(),
    planAdresseOperation: z.string().array(),
    imageLien: z.string().array()
});

export const contractSearchSchema = z.object({
    page: z.coerce.number().positive().nonnegative().nullish(),
    numeroOpportunite: z.coerce.string().regex(/(asc)|(desc)/).nullish(),
    referenceDossier: z.coerce.string().regex(/(asc)|(desc)/).nullish(),
    client: z.coerce.string().regex(/(asc)|(desc)/).nullish(),
    date: z.coerce.string().regex(/(asc)|(desc)/).nullish(),
    nameSearch: z.coerce.string().nullish(),
    referenceDossierSearch: z.coerce.string().nullish(),
    numeroOpportuniteSearch: z.coerce.string().nullish(),
});

export const clientSearchSchema = z.object({
    name: z.string().max(255)
});