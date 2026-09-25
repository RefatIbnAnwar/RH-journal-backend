const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getEntries,
  getEntry,
  createNewEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/entriesController");
const {
  createEntryRules,
  updateEntryRules,
  entryIdRule,
} = require("../validators/entries");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/", getEntries);
router.get("/:id", entryIdRule, validate, getEntry);
router.post("/", createEntryRules, validate, createNewEntry);
router.put("/:id", updateEntryRules, validate, updateEntry);
router.delete("/:id", entryIdRule, validate, deleteEntry);

module.exports = router;
