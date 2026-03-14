// Read server-side data once from the embedded JSON script tags
const plantsData =
  typeof document !== "undefined"
    ? JSON.parse(document.getElementById("plants-data").textContent || "[]")
    : [];
const zombiesData =
  typeof document !== "undefined"
    ? JSON.parse(document.getElementById("zombies-data").textContent || "[]")
    : [];

function getToughnessRank(toughness) {
  if (!toughness) return 0;
  switch (String(toughness).toLowerCase()) {
    case "fragile":
    case "40":
      return 1;
    case "300":
    case "300 DPS":
    case "300 damage per shot":
    case "300 damage per shot (columns 1-3)":
    case "normal":
    case "average":
    case "typical":
      return 2;
    case "solid":
    case "dense":
    case "600 damage per shot":
      return 3;
    case "hardened":
    case "900 damage per shot":
    case "900 damage per shot (columns 4-6)":
      return 4;
    case "protected":
    case "1200 damage per shot":
    case "1500 damage per shot":
    case "1500 damage per shot (columns 7-9)":
      return 5;
    case "great":
    case "2500 damage per shot":
    case "3000":
    case "3000 damage per shot":
    case "3000 dps":
      return 6;
    case "elevated":
    case "4000 damage per shot":
      return 7;
    case "machined":
    case "8000":
      return 8;
    case "undying":
      return 9;
    default:
      return 0;
  }
}

function BattlePage() {
  const [selectedPlant, setSelectedPlant] = React.useState("");
  const [selectedZombie, setSelectedZombie] = React.useState("");
  const [plantDetails, setPlantDetails] = React.useState(null);
  const [zombieDetails, setZombieDetails] = React.useState(null);
  const [loadingPlant, setLoadingPlant] = React.useState(false);
  const [loadingZombie, setLoadingZombie] = React.useState(false);
  const [isBattling, setIsBattling] = React.useState(false);

  const handleBattle = () => {
    if (!plantDetails || !zombieDetails) {
      alert("Please select both a plant and a zombie first!");
      return;
    }
    setIsBattling(true);
    setTimeout(() => {
      setIsBattling(false);
      const plantToughness =
        plantDetails.Toughness || plantDetails.toughness || "";
      const zombieToughness =
        zombieDetails.Toughness || zombieDetails.toughness || "";
      const plantRank = getToughnessRank(plantToughness);
      const zombieRank = getToughnessRank(zombieToughness);
      if (plantRank > zombieRank) {
        alert(
          "Congratulations!  " +
            selectedPlant.charAt(0).toUpperCase() +
            selectedPlant.slice(1).toLowerCase() +
            " wins!",
        );
      } else if (zombieRank > plantRank) {
        alert(
          "Aww too bad...  " +
            selectedZombie.charAt(0).toUpperCase() +
            selectedZombie.slice(1).toLowerCase() +
            " wins.",
        );
      } else {
        alert("It's a tie!");
      }
    }, 2200);
  };

  const handlePlantChange = async (event) => {
    const plantName = event.target.value;
    setSelectedPlant(plantName);

    if (plantName) {
      setLoadingPlant(true);
      try {
        const response = await fetch(
          "/battle/plant-detail?name=" + encodeURIComponent(plantName),
        );
        if (response.ok) {
          const data = await response.json();
          setPlantDetails(data);
        }
      } catch (error) {
        console.error("Error fetching plant details:", error);
        setPlantDetails(null);
      } finally {
        setLoadingPlant(false);
      }
    } else {
      setPlantDetails(null);
    }
  };

  const handleZombieChange = async (event) => {
    const zombieName = event.target.value;
    setSelectedZombie(zombieName);

    if (zombieName) {
      setLoadingZombie(true);
      try {
        const response = await fetch(
          "/battle/zombie-detail?name=" + encodeURIComponent(zombieName),
        );
        if (response.ok) {
          const data = await response.json();
          setZombieDetails(data);
        }
      } catch (error) {
        console.error("Error fetching zombie details:", error);
        setZombieDetails(null);
      } finally {
        setLoadingZombie(false);
      }
    } else {
      setZombieDetails(null);
    }
  };

  const handleRandomPlant = async () => {
    if (!plantsData.length) return;
    const name = plantsData[Math.floor(Math.random() * plantsData.length)];
    setSelectedPlant(name);
    setLoadingPlant(true);
    try {
      const response = await fetch(
        "/battle/plant-detail?name=" + encodeURIComponent(name),
      );
      if (response.ok) {
        const data = await response.json();
        setPlantDetails(data);
      }
    } catch (error) {
      console.error("Error fetching random plant details:", error);
      setPlantDetails(null);
    } finally {
      setLoadingPlant(false);
    }
  };

  const handleRandomZombie = async () => {
    if (!zombiesData.length) return;
    const name = zombiesData[Math.floor(Math.random() * zombiesData.length)];
    setSelectedZombie(name);
    setLoadingZombie(true);
    try {
      const response = await fetch(
        "/battle/zombie-detail?name=" + encodeURIComponent(name),
      );
      if (response.ok) {
        const data = await response.json();
        setZombieDetails(data);
      }
    } catch (error) {
      console.error("Error fetching random zombie details:", error);
      setZombieDetails(null);
    } finally {
      setLoadingZombie(false);
    }
  };

  return React.createElement(
    "div",
    { className: "battle-container" },
    isBattling &&
      React.createElement(
        "div",
        { className: "battle-overlay" },
        plantDetails &&
          plantDetails.image &&
          React.createElement("img", {
            className: "battle-overlay-img",
            src: "https://pvz-2-api.vercel.app" + plantDetails.image,
            alt: selectedPlant,
          }),
        React.createElement("div", { className: "battle-overlay-vs" }, "VS"),
        zombieDetails &&
          zombieDetails.image &&
          React.createElement("img", {
            className: "battle-overlay-img battle-overlay-img--flip",
            src: "https://pvz-2-api.vercel.app" + zombieDetails.image,
            alt: selectedZombie,
          }),
      ),
    React.createElement(
      "div",
      { className: "battle-selects" },
      React.createElement(
        "div",
        { className: "select-group" },
        React.createElement("label", { htmlFor: "plant-select" }, "Plant: "),
        React.createElement(
          "select",
          {
            id: "plant-select",
            value: selectedPlant,
            onChange: handlePlantChange,
          },
          React.createElement(
            "option",
            { value: "" },
            "--Please choose a plant--",
          ),
          plantsData.length > 0
            ? plantsData.map((name) =>
                React.createElement("option", { key: name, value: name }, name),
              )
            : React.createElement(
                "option",
                { value: "" },
                "No plants available",
              ),
        ),
        React.createElement(
          "button",
          { className: "random-btn", onClick: handleRandomPlant },
          "Random Plant",
        ),
      ),
      React.createElement(
        "div",
        { className: "select-group" },
        React.createElement("label", { htmlFor: "zombie-select" }, "Zombie: "),
        React.createElement(
          "select",
          {
            id: "zombie-select",
            value: selectedZombie,
            onChange: handleZombieChange,
          },
          React.createElement(
            "option",
            { value: "" },
            "--Please choose a zombie--",
          ),
          zombiesData.length > 0
            ? zombiesData.map((name) =>
                React.createElement("option", { key: name, value: name }, name),
              )
            : React.createElement(
                "option",
                { value: "" },
                "No zombies available",
              ),
        ),
        React.createElement(
          "button",
          { className: "random-btn", onClick: handleRandomZombie },
          "Random Zombie",
        ),
      ),
    ),
    React.createElement(
      "div",
      { className: "battle-arena" },
      React.createElement(
        "div",
        { className: "battle-card" },
        React.createElement("h2", null, selectedPlant || "Choose a plant"),
        loadingPlant
          ? React.createElement("p", null, "Loading...")
          : plantDetails
            ? React.createElement(
                React.Fragment,
                null,
                plantDetails.image &&
                  React.createElement("img", {
                    src: "https://pvz-2-api.vercel.app" + plantDetails.image,
                    alt: selectedPlant,
                    className: "battle-card-img",
                  }),
                React.createElement(
                  "p",
                  null,
                  React.createElement("strong", null, "Toughness: "),
                  plantDetails.Toughness || plantDetails.toughness || "unknown",
                ),
              )
            : React.createElement(
                "p",
                { className: "placeholder-text" },
                "Select a plant above",
              ),
      ),
      React.createElement("div", { className: "battle-vs" }, "VS"),
      React.createElement(
        "div",
        { className: "battle-card" },
        React.createElement("h2", null, selectedZombie || "Choose a zombie"),
        loadingZombie
          ? React.createElement("p", null, "Loading...")
          : zombieDetails
            ? React.createElement(
                React.Fragment,
                null,
                zombieDetails.image &&
                  React.createElement("img", {
                    src: "https://pvz-2-api.vercel.app" + zombieDetails.image,
                    alt: selectedZombie,
                    className: "battle-card-img",
                  }),
                React.createElement(
                  "p",
                  null,
                  React.createElement("strong", null, "Toughness: "),
                  zombieDetails.Toughness ||
                    zombieDetails.toughness ||
                    "unknown",
                ),
              )
            : React.createElement(
                "p",
                { className: "placeholder-text" },
                "Select a zombie above",
              ),
      ),
    ),
    React.createElement(
      "button",
      { className: "battle-btn", onClick: handleBattle },
      "Battle!",
    ),
  );
}

if (typeof document !== "undefined") {
  const root = ReactDOM.createRoot(document.getElementById("battle-root"));
  root.render(React.createElement(BattlePage));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getToughnessRank };
}
