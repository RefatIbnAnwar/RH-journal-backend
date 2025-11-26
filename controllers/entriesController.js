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

// @route
// @desc
// @access
