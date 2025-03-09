import { Router } from "express"
import { dashboard, docScan, home, profile, scanHistory, settings } from "../controllers/page.controller.js"

const pageRouter = Router();

pageRouter.route("/home").get(home);
pageRouter.route("/dashboard").get(dashboard);
pageRouter.route("/user/profile").get(profile);
pageRouter.route("/user/settings").get(settings);
pageRouter.route("/docs-scan").get(docScan);
pageRouter.route("/scan-history").get(scanHistory);


export default pageRouter;