const express = require("express");
const app = express();
const PORT = process.env.PORT || 4567;

const fs = require("fs");
const path = require("path");

const cardsPath = path.join(__dirname, "cards/en");
let CARDS = [];

try {
  const files = fs.readdirSync(cardsPath);
  files.forEach(file => {
    if (file.endsWith(".json")) {
      const rawData = fs.readFileSync(path.join(cardsPath, file), "utf-8");
      try {
        const jsonData = JSON.parse(rawData);
        jsonData.forEach(card => {
          if (!card.id) card.id = card.number || `${card.name}-${Math.random()}`;
        });
        CARDS.push(...jsonData);
      } catch (err) {
        console.error(`Error parsing ${file}:`, err);
      }
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


const setsPath = path.join("sets/en.json");
let SETS = [];

try {
  const rawData = fs.readFileSync(setsPath, "utf-8");
  SETS = JSON.parse(rawData);
  console.log(`Loaded ${SETS.length} sets.`);
} catch (err) {
  console.error("Error reading sets JSON:", err);
}

function getSetForCard(card) {
  const setId = card.id.split("-")[0];
  return SETS.find(set => set.id === setId);
}


app.get("/sets", (req, res) => {
  const setsMap = new Map();

  CARDS.forEach(card => {
    const set = getSetForCard(card);
    if (set && !setsMap.has(set.id)) {
      setsMap.set(set.id, set);
    }
  });

  const uniqueSets = Array.from(setsMap.values());
  res.json(uniqueSets);
});

// Return the full card JSON
app.get("/cards", (req, res) => {
  const cardsWithSet = CARDS.map(card => ({
    ...card,
    set: getSetForCard(card)
  }));
  res.json(cardsWithSet);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
