import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  getDocsById,
  getUserDocs,
  uploadDocs,
} from "../services/document.service.js";
import { getMatches, scanDocs } from "../services/scan.service.js";

const renderUpload = (req, res) => {
  res.render("upload", {
    title: "Upload Docs | DocScan",
    messages: req.flash(),
    url: req.originalUrl,
  });
};

const renderScanDocs = (req, res) => {
  res.render("scan", {
    title: "Scan | DocScan",
    messages: req.flash(),
    url: req.originalUrl,
  });
};

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    req.flash("error", "No file provided to upload");
    return res.redirect("/upload");
  }

  try {
    const document = await uploadDocs(req.user.id, req.file);
    req.session.docs = { document };

    // req.flash("success", "File uploaded successfully");
    // res.redirect("/documents");

    req.session.save(() => { // Ensure session data is saved before redirect
      req.flash("success", "File uploaded successfully");
      res.redirect("/documents");
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    req.flash("error", "Internal server error while uploading file");
    res.redirect("/upload");
  }
});

const scanDocument = asyncHandler(async (req, res) => {
  const { documentId, compareWith } = req.body;

  if (!documentId) {
    req.flash("error", "Document ID is required");
    return res.redirect("/scan");
  }

  try {
    const matchResults = await scanDocs(req.user.id, documentId, compareWith || null);
    req.flash("success", "Document scanned successfully");
    res.redirect(`/matches/${documentId}`);
  } catch (error) {
    console.error("Scan error:", error.message);
    req.flash("error", "Failed to scan document.");
    res.redirect("/scan");
  }
});

const getUserDocuments = asyncHandler(async (req, res) => {
  try {
    const documents = await getUserDocs(req.user.id);
    res.render("documents", { 
      title: "Your Documents", 
      documents, 
      messages: req.flash() 
    });
  } catch (error) {
    console.error("Get documents error:", error.message);
    req.flash("error", "Failed to fetch documents");
    res.redirect("/");
  }
});

const getDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const document = await getDocsById(req.user.id, id);
    res.render("document", { 
      title: "Document Details", 
      document, 
      messages: req.flash() 
    });
  } catch (error) {
    console.error("Get document error:", error.message);
    req.flash("error", "Failed to fetch document");
    res.redirect("/documents");
  }
});

const getMatchesDocuments = asyncHandler(async (req, res) => {
  const { docId } = req.params;

  try {
    const matches = await getMatches(req.user.id, docId);
    res.render("matches", { 
      title: "Matched Documents", 
      matches, 
      messages: req.flash() 
    });
  } catch (error) {
    console.error("Get matches error:", error.message);
    req.flash("error", "Failed to match the documents");
    res.redirect("/documents");
  }
});

export {
  renderUpload,
  renderScanDocs,
  uploadDocument,
  scanDocument,
  getUserDocuments,
  getDocument,
  getMatchesDocuments,
};