let person;
let boundary;
let creatures = []

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;
let generation = new Generation(15);
let settled = false;

function setup() {
	let canvas = createCanvas(1200, 600);
	// let canvas = createCanvas(windowWidth * 0.95, windowHeight * 0.95);
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
		settled = false;
	}, 30 * 1000);

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

let counter = 1;
function draw() {
	if (counter >= 60)  {
		counter = 0; 
		settled = true;
	}
	counter++;
	background(color(15, 15, 19));

	// Display Boundary
	boundary.display();

	// Display Creatures
	generation.species.forEach((creature) => {
		creature.show();
		creature.adjust_score();
		if ( counter % 5 === 0 && settled ) {
			creature.think(boundary);
		}
	});

	// Display Stats
	fill("red");	
	text("Generation: " + generation.generation, 40, 70);
	text("HighScore: " + generation.high_score.toFixed(2), 40, 100);
	text("Fitness: " + generation.fitness.toFixed(2), 40, 130);

	// Run Matter-JS Engine
	Matter.Engine.update(engine);
}