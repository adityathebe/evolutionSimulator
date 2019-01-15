const config = {
	initialPosition: { x: 1.5, y: 2.7 },
	scale: 100,
	maxTorque: 800,
	simulationSpeed: 1,
	populationSize: 25,
	simulationPeriod: 15,
	mutationRate: 0.05,
	minBodyDelta: 1.1,
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
	runAllSimulationIntervals();
	
	// Show Stats
	setInterval(UIHandler.displayHumanStat, 500);
}

function runAllSimulationIntervals() {
	// Evolve every <config.simulationPeriod> seconds
	globals.evolutionInterval = setInterval(() => {
		GeneticAlgorithm.createNextGeneration();
	}, 1000 * config.simulationPeriod);

	// Run Simulation
	globals.simulationInterval = setInterval(() => {
		config.simulationSpeed = document.getElementById('simulationSlider').value;
		for (let i = 0; i < config.simulationSpeed; i += 1) {
			GeneticAlgorithm.simulateSingleStep();
		}
	}, 1000 / 60);
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
