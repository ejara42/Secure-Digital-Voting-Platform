// routes/electionRoutes.js
import express from "express";
import { getElectionDropdown } from "../controllers/electionController.js";

const router = express.Router();

router.get("/dropdown", getElectionDropdown);

export default router;
