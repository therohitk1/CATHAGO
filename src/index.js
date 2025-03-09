// import dotenv from "dotenv";
// dotenv.config();
// import { app } from "./app.js";
// import { connectDB } from "./config/index.js";
// import models from "./models/index.js"

// connectDB()
//   .then(() => {
//     models.sequelize.sync({ alter: true }).then(() => {
//       console.log("Database & Tables created!")
//     })
//     app.listen(process.env.PORT || 3600, () => {
//       console.log(
//         `Server is running on port http://localhost:${process.env.PORT}`
//       );
//     });
//   })
//   .catch((error) => {
//     console.log("Sqlite DB connection failed", error);
//   });



// import dotenv from "dotenv";
// dotenv.config();
// import { app } from "./app.js";
// import { connectDB } from "./config/index.js";
// import models from "./models/index.js";

// connectDB()
//   .then(async () => {
//     try {
//       await models.sequelize.sync({ force: false, alter: false });
//       console.log("Database connected successfully!");
      
//       app.listen(process.env.PORT || 3600, () => {
//         console.log(
//           `Server is running on port http://localhost:${process.env.PORT || 3600}`
//         );
//       });
//     } catch (error) {
//       console.error("Database initialization error:", error);
//       process.exit(1);
//     }
//   })
//   .catch((error) => {
//     console.log("Sqlite DB connection failed", error);
//     process.exit(1);
//   });


import dotenv from "dotenv";
dotenv.config();

// Import and run PDF setup before any other imports
import { setupPdfEnv } from "./config/pdf-config.js";
setupPdfEnv();

// Now import app and other dependencies
import { app } from "./app.js";
import { connectDB } from "./config/index.js";
import models from "./models/index.js";

connectDB()
  .then(async () => {
    try {
      await models.sequelize.sync({ force: false, alter: false });
      console.log("Database connected successfully!");
      
      app.listen(process.env.PORT || 3600, () => {
        console.log(
          `Server is running on port http://localhost:${process.env.PORT || 3600}`
        );
      });
    } catch (error) {
      console.error("Database initialization error:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.log("Sqlite DB connection failed", error);
    process.exit(1);
  });