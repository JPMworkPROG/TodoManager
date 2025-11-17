import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import config from "./utils/loadEnv";
import swaggerUi from "swagger-ui-express";
import demandRoutes from "./demands/routes/demandRoutes";

const openApiPath = path.join(
  __dirname,
  "../documentation/todoManager.openapi.yml"
);
const swaggerDocument = yaml.parse(fs.readFileSync(openApiPath, "utf8"));

const PORT = config.PORT;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/demands", demandRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
