// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import ejsMate from "ejs-mate";
// import flash from "connect-flash";
// import {
//   setCookieParser,
//   setLogger,
//   setSecurity,
// } from "./security/security.js";
// import { configureSession } from "./security/session.js";
// import authRouter from "./routes/auth.routes.js";
// import pageRouter from "./routes/page.routes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Fix: Changed app.use to app.engine
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// app.use(flash());
// configureSession(app);
// setCookieParser(app);
// setLogger(app);
// setSecurity(app);

// // Make sure flash messages are available in all views
// app.use((req, res, next) => {
//   res.locals.currentUser = req.session.user;
//   res.locals.success = req.flash('success');
//   res.locals.error = req.flash('error');
//   next();
// });

// app.use("/auth", authRouter);

// app.get("/", (req, res) => {
//   res.redirect("/auth/login");
// });

// app.use("/", pageRouter);

// app.get("/dashboard", (req, res) => {
//   res.send("User Dashboard")
// });

// export { app };


// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import ejsMate from "ejs-mate";
// import flash from "connect-flash";
// import {
//   setCookieParser,
//   setLogger,
//   setSecurity,
// } from "./security/security.js";
// import { configureSession } from "./security/session.js";
// import { setupPdfEnv } from "./config/pdf-config.js"
// import authRouter from "./routes/auth.routes.js";
// import pageRouter from "./routes/page.routes.js";
// import docsRouter from "./routes/docs.routes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));


// // Configure session first before flash
// configureSession(app);
// app.use(flash());

// setCookieParser(app);
// setLogger(app);
// setSecurity(app);

// // set up the pdf parse environments
// setupPdfEnv();

// // EJS Configuration
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));



// // Middleware to pass flash messages to all templates
// app.use((req, res, next) => {
//   res.locals.currentUser = req.session.user;
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

// // Routes
// app.use("/auth", authRouter);
// app.use("/", pageRouter, docsRouter);

// app.get("/", (req, res) => {
//   res.redirect("/auth/login");
// });


// export { app };


import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import flash from "connect-flash";
import {
  setCookieParser,
  setLogger,
  setSecurity,
} from "./security/security.js";
import { configureSession } from "./security/session.js";
// Import but don't call setupPdfEnv here
import authRouter from "./routes/auth.routes.js";
import pageRouter from "./routes/page.routes.js";
import docsRouter from "./routes/docs.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configure session first before flash
configureSession(app);
app.use(flash());

setCookieParser(app);
setLogger(app);
setSecurity(app);

// Remove the setupPdfEnv() call from here

// EJS Configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to pass flash messages to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/auth", authRouter);
app.use("/", pageRouter, docsRouter);

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

export { app };