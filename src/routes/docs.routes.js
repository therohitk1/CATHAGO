// import { Router } from "express";
// import {
//   getDocument,
//   getMatchesDocuments,
//   getUserDocuments,
//   renderScanDocs,
//   renderUpload,
//   scanDocument,
//   uploadDocument,
// } from "../controllers/docs.controller.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";
// import { upload } from "../middleware/upload.middleware.js";

// const docsRouter = Router();

// docsRouter.use(verifyJWT);

// docsRouter
//   .route("/upload")
//   .get(renderUpload)
//   .post(upload.single("document"), uploadDocument);
// docsRouter.route("/docs-scan").get(renderScanDocs).post(scanDocument);
// docsRouter.route("/documents").get(getUserDocuments);
// docsRouter.route("/documents/:id").get(getDocument);
// docsRouter.route("/matches/:docId").get(getMatchesDocuments);

// export default docsRouter;

import { Router } from "express";
import {
  getDocument,
  getMatchesDocuments,
  getUserDocuments,
  renderScanDocs,
  renderUpload,
  scanDocument,
  uploadDocument,
} from "../controllers/docs.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const docsRouter = Router();

docsRouter.use(verifyJWT);

docsRouter
  .route("/upload")
  .get(renderUpload)
  .post(upload.single("document"), uploadDocument);
docsRouter.route("/docs-scan").get(renderScanDocs).post(scanDocument);
docsRouter.route("/documents").get(getUserDocuments);
docsRouter.route("/documents/:id").get(getDocument);
docsRouter.route("/matches/:docId").get(getMatchesDocuments);

export default docsRouter;
