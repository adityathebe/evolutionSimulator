let person;
let ground, roof;
let left_wall, right_wall;
let creatures = []

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;

function setup() {
	let canvas = createCanvas(windowWidth * 0.95, windowHeight * 0.95);
	frameRate(60);
	rectMode(CENTER);

	// Create Person
	for (let index = 0; index < 20; index++) {
		let person = new Person(50, 10, 50, 10, width * 0.10, height * 0.80);
		person.init();
		creatures.push(person);
	}

	// Boundaries
	ground = Matter.Bodies.rectangle(width / 2, height - 10, width, 20, {
		isStatic: true,
		friction: 0.8,
		collisionFilter: {
			category: 0x0001
		}
	});

	roof = Matter.Bodies.rectangle(width / 2, 10, width, 20, {
		isStatic: true,
		friction: 0.8,
		collisionFilter: {
			category: 0x0001
		}
	});

	// Left Wall
	left_wall = Matter.Bodies.rectangle(10, height/2, 20, height, {
		isStatic: true,
		friction: 0.8,
		collisionFilter: {
			category: 0x0001
		}
	});

	// Left Wall
	right_wall = Matter.Bodies.rectangle(width - 10, height / 2, 20, height, {
		isStatic: true,
		friction: 0.8,
		collisionFilter: {
			category: 0x0001
		}
	});

	Matter.World.add(world, [ground, roof, left_wall, right_wall]);
	creatures.forEach((person) => {
		Matter.World.add(world, [person.lower_left_leg, person.upper_left_leg, person.lower_right_leg, person.upper_right_leg]);
		
		// Add Main Joints
		Matter.World.add(world, person.left_joint)
		Matter.World.add(world, person.right_joint)
		Matter.World.add(world, person.main_joint)

		// Add Muscle Joints
		Matter.World.add(world, person.main_muscle)
		Matter.World.add(world, person.left_muscle)
		Matter.World.add(world, person.right_muscle)
	})

	// Mouse Constraint
	let canvasMouse = Matter.Mouse.create(canvas.elt);
	canvasMouse.pixelRatio = pixelDensity();
	let m = Matter.MouseConstraint.create(engine, {
		mouse: canvasMouse
	})
	Matter.World.add(world, m);

	
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

	// Display Ground
	fill(color(118, 240, 155))
	rect(ground.position.x, ground.position.y, width, 20);
	rect(left_wall.position.x, left_wall.position.y, 20, height);
	rect(right_wall.position.x, right_wall.position.y, 20, height);
	rect(roof.position.x, roof.position.y, width, 20);

	// Display Person
	fill("#F55F5F")
	creatures.forEach((person) => {
		person.show();
	})

	// Run Matter-JS Engine
	Matter.Engine.update(engine);
}

function keyPressed() {
	// Press SpaceBar to exert small force to all creatures
	if (key === " ") {
		creatures.forEach((person) => {
			Matter.Body.applyForce(person.upper_left_leg, { x: 0, y: 0 }, { x: -0.001, y: 0 })
		})
	}

	// Press W to activate Neural Network
	if (key === "W") {
		creatures.forEach((person) => {
			person.walk();
		})
	}
}