const express = require("express");
const router = express.Router();
const { getResults, getAllResults } = require("../controllers/resultController");

router.get("/", getAllResults);
router.get("/:ballotId", getResults);

module.exports = router;
