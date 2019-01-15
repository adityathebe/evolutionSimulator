const config = {
	scale: 100,
	maxTorque: 1200,
	simulationSpeed: 1,
	populationSize: 20,
	simulationPeriod: 10,
	mutationRate: 0.05,
	minBodyDelta: 1,
	minLegDelta: 0.4,
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
}

const setUpEnvironment = () => {

	// Create World
	const gravity = new b2.Vec2(0, 10);
	const world = new b2.World(gravity, true);
	globals.world = world;

	// Create Floor
	const floor = createFloor();
	globals.floor = floor;

	// Create Human
	GeneticAlgorithm.initializePopulation();
}

let floorImg = null;
let bgImg = null
function preload() {
	floorImg = loadImage('../assets/ground.png');
	bgImg = loadImage('../assets/bg.png');
}

function setup() {
	const canvas = createCanvas(config.canvas.width, config.canvas.height);
	canvas.parent('mainCanvas');

	rectMode(CENTER);
	imageMode(CENTER);

	setUpEnvironment();

	// Evolve
	setInterval(() => {
		GeneticAlgorithm.createNextGeneration();
	}, 1000 * config.simulationPeriod)
}

const simulationSlider = document.getElementById('simulationSlider');
simulationSlider.value = config.simulationSpeed;

function draw() {

	// Run Simulation
	config.simulationSpeed = simulationSlider.value;
	for (let i = 0; i < config.simulationSpeed; i += 1) {
		GeneticAlgorithm.simulateSingleStep();
	}

	background(51);
	scale(config.scale);
	noStroke();
	image(bgImg, 4, 1.68, bgImg.width / config.scale, bgImg.height / config.scale);

	// Display Humans
	for (const human of globals.humans) {
		human.display();
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
