import { Op } from "sequelize"
import Document from "../models/document.model.js"
import Scan from "../models/scan.model.js"
import { findUserById, updateUser } from "./user.service.js"
import { compareDocs } from "../utils/DocsComparison.js"

const scanDocs = async (userId, documentId, existingDocumentId = null) => {
  try {
    const user = await findUserById(userId);
    if(!user) {
      throw new Error("User does not exist");
    }

    if(user.availableCredits < 1) {
      throw new Error("Insufficient credits");
    }

    const document = await Document.findOne({
      where: {id: documentId, userId}
    });

    if(!document) {
      throw new Error("Document does not exist");
    }

    let matchResults = [];

    if(existingDocumentId) {
      const existingDocs = await Document.findByPk(existingDocumentId);

      if(!existingDocs) {
        throw new Error("Document does not exist for comparison");
      }

      const matchScore = await compareDocs(document.extractedText, existingDocs.extractedText);

      const scan = await Scan.create({
        userId,
        documentId1: document.id,
        documentId2: existingDocs.id,
        matchScore,
        matchDetails: JSON.stringify({
          similarityScore: matchScore,
          documentDetails: {
            docs1: {name: document.originalName, size: document.fileSize},
            docs2: {name: existingDocs.originalName, size: existingDocs.fileSize}
          }
        }),
        creditsUsed: 1
      });

      await updateUser(
        {where: {id: userId}},
        {availableCredits: user.availableCredits - 1}
      );

      matchResults.push({
        scan,
        document: existingDocs,
      });

    } else {
      const userDocs = await Document.findAll({
        where: {
          userId,
          id: {[Op.ne]: documentId}
        }
      });

      for(const docs of userDocs) {
        const matchScore = await compareDocs(document.extractedText, docs.extractedText);

        if(matchScore > 0.3) {
          const scan = await Scan.create({
            userId,
            documentId1: document.id,
            documentId2: docs.id,
            matchScore,
            matchDetails: JSON.stringify({
              similarityScore: matchScore,
              documentDetails: {
                docs1: {name: document.originalName, size: document.fileSize},
                docs2: {name: docs.originalName, size: docs.fileSize}
              }
            }),
            creditsUsed: 1
          });

          matchResults.push({
            scan,
            document: docs,
          });
        }
      }

      await updateUser(
        {where: {id: userId}},
        {
          availableCredits: user.availableCredits - 1
        }
      );
    }

    return matchResults;
  } catch (error) {
    throw error;
  }
}

const getMatches = async (userId, docId) => {
  const scans = await Scan.findAll({
    where: {
      userId,
      [Op.or]: [
        {documentId1: docId},
        {documentId2: docId},
      ]
    },
    include: [
      {model: Document, as: 'FirstDocument'},
      {model: Document, as: 'SecondDocument'},
    ],
    order: [['matchScore', 'DESC']]
  });

  return scans.map(scan => {
    const otherDocId = scan.documentId1 === docId ? scan.documentId2 : scan.documentId1;
    const otherDoc = scan.documentId1 === docId ? scan.SecondDocument : scan.FirstDocument;

    return {
      scan,
      otherDocument: otherDoc
    };
  });
};

export { scanDocs, getMatches };