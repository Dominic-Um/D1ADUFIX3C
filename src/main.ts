import wheelIconUrl from "./spinningwheel.jpg";
import "./style.css";

// Game state variables
let speed = 0; // Represents the total accumulated speed (main resource)
let acceleration = 0; // Represents how much speed increases per second

// Interface defining the structure for each upgrade item
interface Item {
  name: string;
  description: string;
  cost: number;
  rate: number;
  count: number;
}

// List of all available upgrades with their properties
const availableItems: Item[] = [
  {
    name: "Alloy Wheels",
    description: "Lightweight rims that reduce drag and boost your top speed.",
    cost: 10,
    rate: 0.1,
    count: 0,
  },
  {
    name: "Turbo Tires",
    description:
      "Grippy performance tires that give extra traction per second.",
    cost: 100,
    rate: 2,
    count: 0,
  },
  {
    name: "Nitro Boost",
    description:
      "Injects pure speed into your system for explosive acceleration.",
    cost: 1000,
    rate: 50,
    count: 0,
  },
  {
    name: "Supercharger",
    description:
      "Forces more air into your engine for continuous high-speed gains.",
    cost: 5000,
    rate: 200,
    count: 0,
  },
  {
    name: "Rocket Engine",
    description:
      "Replaces your motor entirely with jet propulsion—hold on tight!",
    cost: 25000,
    rate: 1000,
    count: 0,
  },
];

// Create the main HTML structure for the game
document.body.innerHTML = `
  <h1>🏁 Speed Clicker: Spin to Win 🏎️</h1>

  <button id="wheelButton" class="main-button">
    <img src="${wheelIconUrl}" alt="Spinning Wheel" width="100" />
    <p>Spin the Wheel!</p>
  </button>

  <div id="speedDisplay">0.000 mph</div>
  <div id="accelDisplay">0.000 mph/sec</div>

  <h2>🧰 Upgrades</h2>
  <div id="upgrades">
    ${
  availableItems
    .map(
      (item) => `
        <div class="upgrade">
          <button id="buy-${item.name.replace(/\s+/g, "")}" disabled>
            Buy ${item.name} (${item.cost.toFixed(1)} mph)
          </button>
          <span id="count-${item.name.replace(/\s+/g, "")}">Owned: 0</span>
          <p class="description">${item.description}</p>
        </div>
      `,
    )
    .join("")
}
  </div>
`;

// Select key UI elements
const wheelButton = document.getElementById("wheelButton") as HTMLButtonElement;
const speedDisplay = document.getElementById("speedDisplay") as HTMLDivElement;
const accelDisplay = document.getElementById("accelDisplay") as HTMLDivElement;

// Map upgrade buttons and counters to their respective items
const upgradeButtons = availableItems.map(
  (item) =>
    document.getElementById(
      `buy-${item.name.replace(/\s+/g, "")}`,
    ) as HTMLButtonElement,
);
const upgradeCounts = availableItems.map(
  (item) =>
    document.getElementById(
      `count-${item.name.replace(/\s+/g, "")}`,
    ) as HTMLSpanElement,
);

// Updates all display elements based on the current game state
function updateDisplay() {
  speedDisplay.textContent = `${speed.toFixed(3)} mph`;
  accelDisplay.textContent = `${acceleration.toFixed(3)} mph/sec`;

  availableItems.forEach((item, i) => {
    upgradeButtons[i].textContent = `Buy ${item.name} (${
      item.cost.toFixed(1)
    } mph)`;
    upgradeButtons[i].disabled = speed < item.cost;
    upgradeCounts[i].textContent = `Owned: ${item.count}`;
  });
}

// Adds manual speed when clicking the main button
wheelButton.addEventListener("click", () => {
  speed++;
  updateDisplay();
});

// Handles purchasing of upgrades and applying their effects
availableItems.forEach((item, i) => {
  upgradeButtons[i].addEventListener("click", () => {
    if (speed >= item.cost) {
      speed -= item.cost;
      item.count++;
      acceleration += item.rate;
      item.cost *= 1.15; // Increases the cost by 15% after each purchase
      updateDisplay();
    }
  });
});

// Main animation loop for continuous speed increase
let lastTime = performance.now();
function animate(time: number) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  speed += acceleration * dt; // Increase speed based on acceleration over time
  updateDisplay();

  requestAnimationFrame(animate); // Continuously update every animation frame
}

// Start the animation loop and initial display
requestAnimationFrame(animate);
updateDisplay();
