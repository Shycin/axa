export interface IContratCreate {
    referenceDossier: string,
    numeroSIRET: string,
    numeroSIREN: string,
    affaire: string,
    intermediaire: string,
    descriptionSuccincte: string,
    imageLien: string,
    presenceCoassurance: boolean,
    adresseOperation: string,
    planAdresseOperation: string,
    descriptifOperation: string,
    coutOperation: number
}

export interface IApiRessourceCreate extends IContratCreate {
    clientId?: string,
    genre: string,
    nom: string,
    prenom: string,
    rue: string,
    ville: string,
    codePostal: string,
}

export type IApiRessourceSelect = {
    numeroOpportunite: number,
    clientId: string,
    client: {
        genre: string,
        nom: string,
        prenom: string,
        rue: string,
        ville: string,
        codePostal: string,
    }
} & IContratCreate