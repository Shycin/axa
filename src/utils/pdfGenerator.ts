import PDFDocument from 'pdfkit';
import fs from 'fs';
import path, { dirname } from 'path';
import { convert } from 'html-to-text';

import { IApiRessourceSelect } from "../dto/api";
import { formatDate } from "./time";


const primary = "#00008F"
const marginLeft = 50
const marginCenter = 300
const maxHeight = 790


export function createContract(contract: IApiRessourceSelect, path: string) {
    let doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });

    const writeStream = fs.createWriteStream('contract.pdf');
    doc.pipe(writeStream);

    generateHeader(doc);
    generateCustomerIdentite(doc, contract)
    newPage(doc)

    generateCustomerReference(doc, contract)
    doc.moveDown(2)
    newPage(doc)

    generateCustomerInformation(doc, contract);
    doc.moveDown(2)
    newPage(doc)

    generateCustomerTechnique(doc, contract);
    doc.moveDown(2)
    newPage(doc)


    doc.end();
    doc.pipe(fs.createWriteStream(path));


    return new Promise((resolve) => {
        writeStream.on('finish', () => {
            console.log('PDF created successfully');
            resolve(true)
        });

        writeStream.on('error', (err) => {
            console.error('Error creating PDF:', err);
            resolve(false)
        });
    });
}


export function newPage(doc) {
    if (doc.y > maxHeight) {
        generateFooter(doc);
        doc.addPage();
    }
}

export function generateHeader(doc) {

    generateHr({ doc, y: doc.y, endX: 250, strokeWidth: 1 });

    doc
        .fillColor(primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("NOUS CONTACTER", marginLeft, doc.y + 5)

    generateHr({ doc, y: doc.y, endX: 250 });

    doc.moveDown()

    doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("VOTRE AGENT GÉNÉRAL", marginLeft)
        .text("JACQUES ANTONY", marginLeft)
        .font("Helvetica")
        .text("6 Pl. de la Pyramide", marginLeft)
        .text("92800 Puteaux", marginLeft)
        .moveDown()
        .font("Helvetica-Bold")
        .text("01 44 45 70 00", marginLeft)
        .text("agence@axa.fr", marginLeft)
        .font("Helvetica")
        .text("https://www.axa.fr/", marginLeft)
        .moveDown();

    doc
        .image(path.join(dirname(require.main.filename), './src/assets/AXA_Logo.png'), marginCenter, 50, { width: 50 })
        .fillColor(primary)
        .fontSize(20)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Assurance et Banque", 200, 50, { align: "right" })
        .moveDown();
}

export function generateCustomerIdentite(doc, contract: IApiRessourceSelect) {

    const customerReferenceTop = 150;

    doc
        .fillColor(primary)
        .fontSize(10)
        .font("Helvetica")
        .text((contract.client.genre === "H" ? "M." : "Mme.") + " " + contract.client.prenom + " " + contract.client.nom, marginCenter, customerReferenceTop)
        .text(contract.client.rue, marginCenter, customerReferenceTop + 15)
        .text(contract.client.codePostal + " " + contract.client.ville, marginCenter, customerReferenceTop + 30)
        .moveDown();
}

export function generateCustomerReference(doc, contract: IApiRessourceSelect) {

    generateHr({ doc, y: doc.y, endX: 250, strokeWidth: 1 });

    doc
        .fillColor(primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("VOS RÉFÉRENCE", marginLeft, doc.y + 5)

    generateHr({ doc, y: doc.y, endX: 250 });

    doc.moveDown()

    doc
        .fillColor(primary)
        .fontSize(10)
        .font("Helvetica")
        .text("Nom client ", marginLeft, doc.y)
        .text((contract.client.genre === "H" ? "M." : "Mme.") + " " + contract.client.prenom + " " + contract.client.nom, 150, doc.y - doc.currentLineHeight())
        .text("Numéro SIRET ", marginLeft, doc.y)
        .text(contract.numeroSIRET, 150, doc.y - doc.currentLineHeight())
        .text("Numéro SIREN ", marginLeft, doc.y)
        .text(contract.numeroSIREN, 150, doc.y - doc.currentLineHeight())
        .moveDown();
}

export function generateCustomerInformation(doc, contract: IApiRessourceSelect) {

    doc
        .fillColor(primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Numéro du dossier : " + contract.referenceDossier, marginLeft, doc.y + 20)

    generateHr({ doc, y: doc.y });

    doc.moveDown()


    doc
        .fontSize(12)
        .font("Helvetica")
        .text("Informations générales :", marginLeft, doc.y, { underline: true })
        .moveDown()
        .fontSize(10)
        .text("Date du dossier ", marginLeft, doc.y)
        .text(formatDate(new Date()), marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Affaire n° ", marginLeft, doc.y)
        .text(contract.affaire, marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Coassurance ? ", marginLeft, doc.y)
        .text(contract.presenceCoassurance ? "Oui" : "Non", marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Intermédiaire ", marginLeft, doc.y)
        .text(contract.intermediaire, marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Description ", marginLeft, doc.y)
        .text(contract.descriptionSuccincte, marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Image description :", marginLeft, doc.y)
        .moveDown();


    const imageHeight = 100
    JSON.parse(contract.imageLien).forEach((element, index) => {
        if (maxHeight < doc.y + imageHeight) {
            doc.addPage();
        }

        doc
            .fillColor(primary)
            .font("Helvetica-Bold")
            .image(path.join(dirname(require.main.filename), './public/uploads/' + element), marginLeft, doc.y, { height: imageHeight })
            .moveDown(imageHeight / doc.currentLineHeight())

        newPage(doc)
    })
}

export function generateCustomerTechnique(doc, contract) {

    doc
        .fontSize(12)
        .font("Helvetica")
        .text("Caractéristiques techniques :", marginLeft, doc.y, { underline: true })
        .moveDown()
        .fontSize(10)
        .text("Adresse de l'opération ", marginLeft, doc.y)
        .text(contract.adresseOperation, marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Coût de l'opération ", marginLeft, doc.y)
        .text(contract.coutOperation + "€", marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Descriptif détaillé ", marginLeft, doc.y)
        .text(convert(contract.descriptifOperation), marginLeft + 150, doc.y - doc.currentLineHeight())
        .moveDown(0.5)
        .text("Plan de l'adresse :", marginLeft, doc.y)
        .moveDown()

    const imageHeight = 100
    JSON.parse(contract.planAdresseOperation).forEach((element, index) => {
        if (maxHeight < doc.y + imageHeight) {
            doc.addPage();
        }

        doc
            .fillColor(primary)
            .font("Helvetica-Bold")
            .image(path.join(dirname(require.main.filename), './public/uploads/' + element), marginLeft, doc.y, { height: imageHeight })
            .moveDown(imageHeight / doc.currentLineHeight())

        newPage(doc)
    })
}

export function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
            marginLeft,
            779,
            { align: "center", width: 500 }
        );
}

export function generateHr({ doc, y, startX = 50, endX = 550, strokeWidth = 1, strokeColor = primary }) {
    doc
        .strokeColor(strokeColor)
        .lineWidth(strokeWidth)
        .moveTo(startX, y)
        .lineTo(endX, y)
        .stroke();
}