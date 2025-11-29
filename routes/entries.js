const express = require("express");

const { protect } = require("../middleware/auth");
const {
  getEntries,
  getEntry,
  createNewEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/entriesController");

const router = express.Router();

router.use(protect);

router.get("/", getEntries);
router.get("/:id", getEntry);
router.post("/", createNewEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

module.exports = router;
