const { json } = require("express");
const JournalEntry = require("../models/JournalEntry");

// @route   Get /api/entries
// @desc    Get all entries for logged-in user
// @access  Private
exports.getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({
      data: -1,
    });

    res.status(200).json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// @route GET /api/entries/:id
// @desc Get single entry by id
// @access private

exports.getEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    if (entry.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Not Authorised to view this entry." });
    }

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// @route   POST /api/entries
// @desc    create new entry
// @access  Private
exports.createNewEntry = async (res, req) => {
  try {
    const { title, content, date } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const entry = await JournalEntry.create({
      user: req.user.id,
      title: title || "Untitled",
      content,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/entries/:id
// @desc    Update entry
// @access  Private
exports.updateEntry = async (req, res) => {
  try {
    let entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found." });
    }

    if (entry.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Not Authorise to update this entry" });
    }

    const { title, content, date } = req.body;

    if (title) entry.title = title;
    if (content) entry.content = content;
    if (date) entry.date = new Date(date);
    entry.updatedAt = new Date();

    await entry.save();

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error(error);
    res.status(500), json({ error: error.message });
  }
};

// @route   DELETE /api/entries/:id
// @desc    Delete entry
// @access  Private
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    if (entry.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Not authorized to delete this entry" });
    }

    await JournalEntry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Entry deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
