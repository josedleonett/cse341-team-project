import { Router } from "express";
import { getAllTrips, getTripById } from "../controllers/trips.js";
import { trainsApi } from "./trains.js";

const router = Router();

router.get("/trains", trainsApi);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags:
 *       - Trips
 *     responses:
 *       200:
 *         description: An array of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Trip"
 *       500:
 *         description: Failed to fetch trips
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 * /api/trips/{id}:
 *   get:
 *     summary: Get one trip by ID
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The trip's custom string ID
 *         schema:
 *           type: string
 *         example: alpine-panorama
 *     responses:
 *       200:
 *         description: The requested trip
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Trip"
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: Failed to fetch trip
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - region
 *         - startStation
 *         - endStation
 *         - duration
 *         - distance
 *         - operatingMonths
 *       properties:
 *         id:
 *           type: string
 *           example: alpine-panorama
 *         name:
 *           type: string
 *           example: Alpine Panorama Express
 *         description:
 *           type: string
 *         region:
 *           type: string
 *           example: central
 *         startStation:
 *           type: string
 *           example: nagoya
 *         endStation:
 *           type: string
 *           example: toyama
 *         duration:
 *           type: string
 *           example: 4.5 hours
 *         distance:
 *           type: number
 *           example: 180
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *         bestSeason:
 *           type: string
 *           example: autumn
 *         operatingMonths:
 *           type: array
 *           items:
 *             type: integer
 *           example: [4, 5, 6, 7, 8, 9, 10, 11]
 *         imageUrl:
 *           type: string
 *           example: /images/routes/alpine-panorama.png
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *           example: Trip not found
 */
router.get("/trips", getAllTrips);
router.get("/trips/:id", getTripById);

export default router;
