let person;
let ground;

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;

function setup() {
	let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
	frameRate(60);
	rectMode(CENTER);	
	
	// Create Person
	person = new Person(50, 20, 50, 10, width / 2, 0);
	person.init();

	// add all of the bodies to the world
	ground = Matter.Bodies.rectangle(width / 2, height, width, 40, { 
		isStatic: true, 
		friction: 0.8,
		collisionFilter: {
			category: 0x0001
		}
	});
	Matter.World.add(world, [ground, person.lower_left_leg, person.upper_left_leg, person.lower_right_leg, person.upper_right_leg]);
	Matter.World.add(world, person.left_joint)
	Matter.World.add(world, person.right_joint)
	Matter.World.add(world, person.main_joint)

	// Mouse Constraint
	let canvasMouse = Matter.Mouse.create(canvas.elt);
	canvasMouse.pixelRatio = pixelDensity();
	let m = Matter.MouseConstraint.create(engine, {
		mouse: canvasMouse
	})
	Matter.World.add(world, m)

	// Run the renderer
	// Render.run(Render.create({
	// 	element: document.body,
	// 	engine: engine
	// });
}

function draw() {
	background(color(15, 15, 19));

	// Display Ground
	fill(color(118, 240, 155))
	rect(ground.position.x, ground.position.y, width, 40);

	// Display Person
	fill("#F55F5F")
	person.show();

	// Run Matter-JS Engine
	Matter.Engine.update(engine);
}