const config = {
  initialPosition: { x: 1.5, y: 2.7 },
  scale: 100,
  maxTorque: 800,
  simulationSpeed: 1,
  populationSize: 20,
  simulationPeriod: 20,
  mutationRate: 0.05,
  minBodyDelta: 1.2,
  minLegDelta: 0.3,
  motorNoise: 0.05,
  canvas: {
    width: 800,
    height: 400,
  },
}

const globals = {
  world: null,
  stepCounter: 0,
  generationIndex: -1,
  humans: [],
  generationHighScores: [],
  generationAvgScores: [],
  bestHuman: { score: 0, stepsMade: 0 },
}

let floorImg, bgImg;
function preload() {
  floorImg = loadImage('../assets/ground.png');
  bgImg = loadImage('../assets/bg.png');
}

const setUpEnvironment = () => {

  // Create World
  const gravity = new b2.Vec2(0, 10);
  globals.world = new b2.World(gravity, true);

  // Create Floor
  globals.floor = createFloor();

  // Create Humans
  GeneticAlgorithm.initializePopulation();
}

function setup() {
  const canvas = createCanvas(config.canvas.width, config.canvas.height);
  canvas.parent('mainCanvas');

  rectMode(CENTER);
  imageMode(CENTER);

  setUpEnvironment();
  GeneticAlgorithm.runAllSimulationIntervals();

  // Show Stats
  setInterval(UIController.displayHumanStat, 500);
}

function draw() {

  background(51);
  scale(config.scale);
  noStroke();
  image(bgImg, 4, 1.68, bgImg.width / config.scale, bgImg.height / config.scale);

  // Display Humans
  for (const human of globals.humans) {
    if (human.isAlive) {
      human.display();
    }
  }

  // drawRect(globals.floor);
  image(floorImg, 4, 4 + 0.1, floorImg.width / config.scale, floorImg.height / config.scale);

}

function drawRect(body) {
  const fixture = body.GetFixtureList();
  const shape = fixture.GetShape();
  beginShape();
  for (var i = 0; i < 4; i += 1) {
    const { x, y } = body.GetWorldPoint(shape.m_vertices[i]);
    vertex(x, y);
  }
  endShape();
}

const rangeInput = document.getElementById('simulationSlider');
rangeInput.addEventListener("input", function (event) {
  config.simulationSpeed = rangeInput.value;
  clearInterval(globals.simulationInterval);
  clearInterval(globals.evolutionInterval);
  if (config.simulationSpeed > 0) {
    GeneticAlgorithm.runAllSimulationIntervals();
  }
}, false);