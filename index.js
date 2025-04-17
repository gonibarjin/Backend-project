require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const entryRoutes = require("./routes/entries");
app.use("/api/entries", entryRoutes);

app.get("/", (req, res) => {
  res.send("API is running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
