import { Router } from "express";
import { aboutPage, homePage, testErrorPage } from "./index.js";
import { listTripsPage, tripDetailsPage } from "../controllers/trips.js";
import railTripsRouter from "./trips.js";
import { trainsPage } from "./trains.js";

const router = Router();

router.get("/", homePage);
router.get("/about", aboutPage);
router.get("/trains", trainsPage);
router.get("/trips", listTripsPage);
router.get("/trips/:tripId", tripDetailsPage);
router.use("/trips", railTripsRouter);
router.get("/500", testErrorPage);

export default router;
