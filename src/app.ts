import express from "express";
import identifyRoutes from "./routes/identify.route";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { connectDatabase } from "./configs/database.config";

dotenv.config();
const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BiteSpeed Backend",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/identify.route.ts"],
};
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
app.use("/api", identifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${PORT}`);
});
