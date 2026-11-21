import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import pkg from "../package.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDirectory = path.join(__dirname, "routes");
const routeFiles = readdirSync(routesDirectory)
  .filter((file) => file.endsWith(".js"))
  .map((file) => path.join(routesDirectory, file));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kizuna Rail API",
      version: pkg.version,
    },
    servers: [{ url: "/" }],
  },
  apis: routeFiles,
});

export default swaggerSpec;
