const config = {
	scale: 100,
	maxTorque: 1200,
	simulationSpeed: 1,
	populationSize: 20,
	canvas: {
		width: 800,
		height: 400,
	},
}

const globals = {
	world: null,
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
	for (let i = 0; i < config.populationSize; i += 1) {
		const aditya = new Human(2, 2.7);
		globals.humans.push(aditya);
	}

}

let floorImg = null;
let bgImg = null
function preload() {
	floorImg = loadImage('ground.png');
	bgImg = loadImage('bg.png');
}

function setup() {
	const canvas = createCanvas(config.canvas.width, config.canvas.height);
	canvas.parent('mainCanvas');

	rectMode(CENTER);
	imageMode(CENTER);

	setUpEnvironment();
}

const simulationSlider = document.getElementById('simulationSlider');
simulationSlider.value = config.simulationSpeed;

function draw() {
	// Run Simulation
	config.simulationSpeed = simulationSlider.value;
	for (let i = 0; i < config.simulationSpeed; i += 1) {
		update();
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

function update() {
	globals.world.Step(1 / 60, 8, 3);
	globals.world.ClearForces();
	for (const human of globals.humans) {
		human.walk();
	}
};


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
