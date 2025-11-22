const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,

    default: Date.now,
  },
  updatedAt: {
    type: Date,

    default: Date.now,
  },
});

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
