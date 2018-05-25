let person;
let boundary;
let creatures = []

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;
let generation = new Generation(10);

function setup() {
	let canvas = createCanvas(windowWidth * 0.95, windowHeight * 0.95);
	frameRate(60);
	rectMode(CENTER);
	textSize(25)
	fill(255);

	// Initialize Generation
	generation.initialize(Person);
	generation.species.forEach((creature) => { creature.add_to_world(world) });

	// Boundary
	boundary = new SimpleBoundary();
	boundary.add_to_world();

	// Mouse Constraint
	let canvasMouse = Matter.Mouse.create(canvas.elt);
	canvasMouse.pixelRatio = pixelDensity();
	let m = Matter.MouseConstraint.create(engine, { mouse: canvasMouse });
	Matter.World.add(world, m);

	// Restart Generation after 5 seconds
	setInterval(() => {
		generation.evolve();
	}, 15000);

	// Run the renderer
	// let render = Render.create({
	// 	element: document.body,
	// 	engine: engine,
	// 	options: {
	// 		height, width
	// 	}
	// })
	// Render.run(render);

	// let renderMouse = Matter.Mouse.create(render.canvas);
	// renderMouse.pixelRatio = pixelDensity();
	// Matter.World.add(world, Matter.MouseConstraint.create(engine, {
	// 	mouse: renderMouse
	// }));
}

function draw() {
	background(color(15, 15, 19));

	// Display Boundary
	boundary.display();

	// Display Creatures
	generation.species.forEach((creature) => {
		creature.show();
		creature.adjust_score();
		creature.think(boundary);
	});

	// Display Stats
	fill("red");
	text("Generation: " + generation.generation, 40, 70);
	text("HighScore: " + generation.high_score.toFixed(2), 40, 100);

	// Run Matter-JS Engine
	Matter.Engine.update(engine);
}

function keyPressed() {
	// Press SpaceBar to exert small force to all creatures
	if (key === " ") {
		generation.species.forEach((person) => {
			Matter.Body.applyForce(person.upper_left_leg, { x: 0, y: 0 }, { x: -0.001, y: 0 })
		})
	}

	// Press Enter to activate Neural Network
	if (keyCode === ENTER) {
		generation.species.forEach((person) => {
			person.walk();
		})
	}
}