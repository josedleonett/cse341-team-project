import { Router } from "express";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
  getAllStations,
  getStationById,
} from "../controllers/stations.js";

const router = Router();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kizuna Rail API",
      version: "1.0.0",
    },
    servers: [{ url: "/" }],
  },
  apis: [fileURLToPath(import.meta.url)],
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get("/openapi.json", (req, res) => res.status(200).json(swaggerSpec));

/**
 * @openapi
 * /api/stations:
 *   get:
 *     summary: Get all stations
 *     tags:
 *       - Stations
 *     responses:
 *       200:
 *         description: A list of stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Station"
 *       500:
 *         description: The stations could not be retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 * /api/stations/{id}:
 *   get:
 *     summary: Get a station by its ID
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The station's string ID.
 *         schema:
 *           type: string
 *         example: nagoya
 *     responses:
 *       200:
 *         description: The requested station.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Station"
 *       404:
 *         description: No station exists with the requested ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: The station could not be retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - prefecture
 *         - region
 *         - facilities
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           example: nagoya
 *         name:
 *           type: string
 *           example: Nagoya Station
 *         prefecture:
 *           type: string
 *           example: Aichi
 *         region:
 *           type: string
 *           example: central
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - restaurant
 *             - shop
 *         description:
 *           type: string
 *           example: Major transportation hub in central Japan.
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *           example: Station not found
 */
router.get("/stations", getAllStations);
router.get("/stations/:id", getStationById);

export default router;
