import path from "path"
import fs from "fs-extra"
import Document from "../models/document.model.js"
import { findUserById } from "./user.service.js"
import {  extractTextFromDocs} from "../utils/TextExtractor.js"

const uploadDocs = async (userId, file) => {
  try {
    const user = await findUserById(userId);

    if(!user) {
      throw new Error("User does not exist");
    }

    const document = await Document.create({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      extractedText: await extractTextFromDocs(file.path)
    });
  
    return document;
  } catch (error) {
    if (file && file.path) {
      await fs.remove(file.path).catch(err => console.error("Error removing file:", err));
    }
    throw error;
  }
};

const getDocsById = async (userId, docId) => {
  const docs = await Document.findOne({
    where: {id: docId, userId}
  });

  if(!docs) {
    throw new Error("Document does not exist");
  }

  return docs;
};

const getUserDocs = async (userId) => {
  return await Document.findAll({
    where: {userId},
    order: [["createdAt", 'DESC']]
  })
};

export { uploadDocs, getDocsById, getUserDocs };