// Read server-side data once from the embedded JSON script tags
const plantsData = JSON.parse(
  document.getElementById("plants-data").textContent || "[]",
);
const zombiesData = JSON.parse(
  document.getElementById("zombies-data").textContent || "[]",
);

function getToughnessRank(toughness) {
  if (!toughness) return 0;
  switch (toughness.toLowerCase()) {
    case "fragile":
      return 1;
    case "normal":
    case "average":
    case "typical":
      return 2;
    case "solid":
    case "dense":
      return 3;
    case "hardened":
      return 4;
    case "protected":
      return 5;
    case "great":
      return 6;
    case "elevated":
      return 7;
    case "machined":
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

  const handleBattle = () => {
    if (!plantDetails || !zombieDetails) {
      alert("Please select both a plant and a zombie first!");
      return;
    }
    const plantToughness =
      plantDetails.Toughness || plantDetails.toughness || "";
    const zombieToughness =
      zombieDetails.Toughness || zombieDetails.toughness || "";
    const plantRank = getToughnessRank(plantToughness);
    const zombieRank = getToughnessRank(zombieToughness);
    if (plantRank > zombieRank) {
      alert(selectedPlant + " wins!");
    } else if (zombieRank > plantRank) {
      alert(selectedZombie + " wins!");
    } else {
      alert("Tie!");
    }
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

  return React.createElement(
    "div",
    { className: "battle-container" },
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

const root = ReactDOM.createRoot(document.getElementById("battle-root"));
root.render(React.createElement(BattlePage));
