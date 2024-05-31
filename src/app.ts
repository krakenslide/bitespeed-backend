import express from "express";
import identifyRoutes from "./routes/routes";

const app = express();
app.use(express.json());

app.use("/api", identifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
