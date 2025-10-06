const express = require("express");
const app = express();
const PORT = 4567;

const fs = require("fs");
const path = require("path");

const cardsPath = path.join(__dirname, "cards/en");
let CARDS = [];

try {
  const files = fs.readdirSync(cardsPath);
  files.forEach(file => {
    if (file.endsWith(".json")) {
      const rawData = fs.readFileSync(path.join(cardsPath, file));
      const jsonData = JSON.parse(rawData);
      CARDS.push(...jsonData);
    }
  });
  console.log(`Loaded ${CARDS.length} cards.`);
} catch (err) {
  console.error("Error reading cards JSON:", err);
}

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to your Pokémon TCG API (JS version)!");
});

app.get("/cards", (req, res) => {
  res.json(CARDS);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
