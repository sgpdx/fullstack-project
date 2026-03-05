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
  plantsAPIURL,
  zombiesAPIURL,
  areasAPIURL,
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
  res.render("wiki-main");
});

app.get("/plants", async (req, res) => {
  const item = req.query.item;
  if (item) {
    try {
      const response = await fetch(
        plantsAPIURL + "/" + encodeURIComponent(item),
      );
      const detail = response.ok ? await response.json() : null;
      return res.render("wiki-details", {
        title: "Plants",
        heading: `Details for ${item}`,
        baseUrl: plantsAPIURL,
        detailData: detail,
        itemName: item,
        listPath: "/plants",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error fetching item data");
    }
  }
  const plantsData = await getPlantsData();
  res.render("wiki-data", {
    title: "Plants",
    heading: "Plants of Plants vs. Zombies",
    baseUrl: plantsAPIURL,
    data: plantsData,
  });
});

app.get("/zombies", async (req, res) => {
  const item = req.query.item;
  if (item) {
    try {
      const response = await fetch(
        zombiesAPIURL + "/" + encodeURIComponent(item),
      );
      const detail = response.ok ? await response.json() : null;
      return res.render("wiki-details", {
        title: "Zombies",
        heading: `Details for ${item}`,
        baseUrl: zombiesAPIURL,
        detailData: detail,
        itemName: item,
        listPath: "/zombies",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error fetching item data");
    }
  }
  const zombiesData = await getZombiesData();
  res.render("wiki-data", {
    title: "Zombies",
    heading: "Zombies of Plants vs. Zombies",
    baseUrl: zombiesAPIURL,
    data: zombiesData,
  });
});

app.get("/areas", async (req, res) => {
  const item = req.query.item;
  if (item) {
    try {
      const response = await fetch(
        areasAPIURL + "/" + encodeURIComponent(item),
      );
      const detail = response.ok ? await response.json() : null;
      return res.render("wiki-details", {
        title: "Areas",
        heading: `Details for ${item}`,
        baseUrl: areasAPIURL,
        detailData: detail,
        itemName: item,
        listPath: "/areas",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error fetching item data");
    }
  }
  const areasData = await getAreasData();
  res.render("wiki-data", {
    title: "Areas",
    heading: "Areas of Plants vs. Zombies",
    baseUrl: areasAPIURL,
    data: areasData,
  });
});

app.get("/battle/plant-detail", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "name required" });
  try {
    const response = await fetch(plantsAPIURL + "/" + encodeURIComponent(name));
    const data = response.ok ? await response.json() : null;
    res.json(data);
  } catch (err) {
    res.status(500).json(null);
  }
});

app.get("/battle/zombie-detail", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "name required" });
  try {
    const response = await fetch(zombiesAPIURL + "/" + encodeURIComponent(name));
    const data = response.ok ? await response.json() : null;
    res.json(data);
  } catch (err) {
    res.status(500).json(null);
  }
});

app.get("/battle", async (req, res) => {
  const plantsData = await getPlantsData();
  const zombiesData = await getZombiesData();
  res.render("battle", {
    title: "Battle",
    heading: "Battle Plants vs. Zombies!",
    p_data: plantsData,
    z_data: zombiesData,
  });
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
