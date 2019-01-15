const config = {
	initialPosition: { x: 2.2, y: 2.5 },
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

	// Evolve
	setInterval(() => {
		GeneticAlgorithm.createNextGeneration();
	}, 1000 * config.simulationPeriod)
}

function draw() {

	// Run Simulation
	config.simulationSpeed = document.getElementById('simulationSlider').value;
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

	UIHandler.displayHumanStat();
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
