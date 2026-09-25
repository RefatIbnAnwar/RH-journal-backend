const JournalEntry = require("../models/JournalEntry");
const { notFound, unauthorized } = require("../errors/AppError");

exports.getEntries = async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user.id }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    count: entries.length,
    entries,
  });
};

exports.getEntry = async (req, res) => {
  const entry = await JournalEntry.findById(req.params.id);

  if (!entry) {
    throw notFound("Entry");
  }

  if (entry.user.toString() !== req.user.id) {
    throw unauthorized("Not authorized to view this entry");
  }

  res.status(200).json({
    success: true,
    entry,
  });
};

exports.createNewEntry = async (req, res) => {
  const { title, content, date } = req.body;

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
};

exports.updateEntry = async (req, res) => {
  let entry = await JournalEntry.findById(req.params.id);

  if (!entry) {
    throw notFound("Entry");
  }

  if (entry.user.toString() !== req.user.id) {
    throw unauthorized("Not authorized to update this entry");
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
};

exports.deleteEntry = async (req, res) => {
  const entry = await JournalEntry.findById(req.params.id);

  if (!entry) {
    throw notFound("Entry");
  }

  if (entry.user.toString() !== req.user.id) {
    throw unauthorized("Not authorized to delete this entry");
  }

  await JournalEntry.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Entry deleted",
  });
};
