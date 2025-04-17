const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newEntry = new Entry({ title, content });
    const savedEntry = await newEntry.save();

    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error creating entry", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching entries" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found " });
    }
    res.status(200).json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching entry" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedEntry = await Entry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEntry) {
      res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json(updatedEntry);
  } catch (err) {
    console.error("Error during PUT:", err.message);
    res.status(500).json({ message: "Server error while updating entry" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedEntry = await Entry.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error during DELETE", err.message);
    res.status(500).json({ message: "Server error while deleting entry" });
  }
});

module.exports = router;
