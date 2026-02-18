// Main application
// Initial code outline from Fullstack/HW3
// Edits and additional code by Serena Glick, Winter 2026

const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const {
  getPlantsData,
  getZombiesData,
  getAreasData,
} = require("./back-end.js");

app.set("views", "./public/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    heading: "Welcome to the Plants vs. Zombies Wiki & Battle Site",
  });
});

app.get("/wiki", async (req, res) => {
  res.render("wiki");
});

app.get("/plants", async (req, res) => {
  const plantsData = await getPlantsData();
  res.render("plants", {
    title: "Plants",
    heading: "Plants of Plants vs. Zombies",
    data: plantsData,
  });
});

app.get("/zombies", async (req, res) => {
  const zombiesData = await getZombiesData();
  res.render("zombies", {
    title: "Zombies",
    heading: "Zombies of Plants vs. Zombies",
    data: zombiesData,
  });
});

app.get("/areas", async (req, res) => {
  const areasData = await getAreasData();
  res.render("areas", {
    title: "Areas",
    heading: "Areas of Plants vs. Zombies",
    data: areasData,
  });
});

app.get("/battle", async (req, res) => {
  res.render("battle");
});

app.get("/about", async (req, res) => {
  res.render("about");
});

// Other Routes - Error Handling
app.use((req, res) => {
  res.status(404).send("404 - page not found");
});

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
