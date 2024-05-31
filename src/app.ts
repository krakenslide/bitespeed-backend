import express from "express";
import identifyRoutes from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BiteSpeed Backend",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/routes.ts"],
};
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
app.use("/api", identifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
