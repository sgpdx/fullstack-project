// Initial code outline from Fullstack/HW3
// Edits and additional code by Serena Glick, Winter 2026

const rawCache = {
  plants: null,
  zombies: null,
  areas: null,
};

const plantsAPIURL = "https://pvz-2-api.vercel.app/api/plants";
const zombiesAPIURL = "https://pvz-2-api.vercel.app/api/zombies";
const areasAPIURL = "https://pvz-2-api.vercel.app/api/areas";

async function getPlantsData() {
  try {
    let data;
    if (rawCache.plants) {
      data = rawCache.plants;
    } else {
      const response = await fetch(plantsAPIURL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      data = await response.json();
      rawCache.plants = data;
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getZombiesData() {
  try {
    let data;
    if (rawCache.zombies) {
      data = rawCache.zombies;
    } else {
      const response = await fetch(zombiesAPIURL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      data = await response.json();
      rawCache.zombies = data;
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getAreasData() {
  try {
    let data;
    if (rawCache.areas) {
      data = rawCache.areas;
    } else {
      const response = await fetch(areasAPIURL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      data = await response.json();
      rawCache.areas = data;
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  getPlantsData,
  getZombiesData,
  getAreasData,
  plantsAPIURL,
  zombiesAPIURL,
  areasAPIURL,
};
