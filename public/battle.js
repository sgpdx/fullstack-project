// Read server-side data once from the embedded JSON script tags
const plantsData = JSON.parse(
  document.getElementById("plants-data").textContent || "[]",
);
const zombiesData = JSON.parse(
  document.getElementById("zombies-data").textContent || "[]",
);

function BattlePage() {
  const [selectedPlant, setSelectedPlant] = React.useState("");
  const [selectedZombie, setSelectedZombie] = React.useState("");
  const [plantDetails, setPlantDetails] = React.useState(null);
  const [zombieDetails, setZombieDetails] = React.useState(null);
  const [loadingPlant, setLoadingPlant] = React.useState(false);
  const [loadingZombie, setLoadingZombie] = React.useState(false);

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
    selectedPlant &&
      React.createElement(
        "div",
        { className: "plant-details" },
        React.createElement("h2", null, "Selected Plant: " + selectedPlant),
        loadingPlant
          ? React.createElement("p", null, "Loading plant details...")
          : plantDetails
            ? React.createElement(
                "div",
                { className: "details-card" },
                plantDetails.image &&
                  React.createElement("img", {
                    src: "https://pvz-2-api.vercel.app" + plantDetails.image,
                    alt: selectedPlant,
                  }),
                React.createElement(
                  "div",
                  { className: "stats" },
                  React.createElement(
                    "p",
                    null,
                    React.createElement("strong", null, "Toughness: "),
                    plantDetails.Toughness ||
                      plantDetails.toughness ||
                      "unknown",
                  ),
                ),
              )
            : React.createElement("p", null, "Failed to load plant details"),
      ),
    selectedZombie &&
      React.createElement(
        "div",
        { className: "zombie-details" },
        React.createElement("h2", null, "Selected Zombie: " + selectedZombie),
        loadingZombie
          ? React.createElement("p", null, "Loading zombie details...")
          : zombieDetails
            ? React.createElement(
                "div",
                { className: "details-card" },
                zombieDetails.image &&
                  React.createElement("img", {
                    src: "https://pvz-2-api.vercel.app" + zombieDetails.image,
                    alt: selectedZombie,
                  }),
                React.createElement(
                  "div",
                  { className: "stats" },
                  React.createElement(
                    "p",
                    null,
                    React.createElement("strong", null, "Toughness: "),
                    zombieDetails.Toughness ||
                      zombieDetails.toughness ||
                      "unknown",
                  ),
                ),
              )
            : React.createElement("p", null, "Failed to load zombie details"),
      ),
  );
}

const root = ReactDOM.createRoot(document.getElementById("battle-root"));
root.render(React.createElement(BattlePage));
