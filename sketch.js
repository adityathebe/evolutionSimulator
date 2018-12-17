let person;
let boundary;
let creatures = []

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;
const generationPeriod = 15;
let generation = new Generation(20);

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);

	// Initialize Generation
	generation.initialize(Bipedal, {
		id: 1,
		leftLegLength: 60,
		rightLegLength: 60,
		bodyLength: 100,
		leftLegWidth: 10,
		rightLegWidth: 10,
		bodyWidth: 20,
		posX: width * 0.1,
		posY: height * 0.80,
	});
	generation.species.forEach((creature) => { creature.addToWorld(world) });

	// Boundary
	boundary = new SimpleBoundary();
	boundary.add_to_world(world);

	// Run Engine
	Matter.Engine.run(engine);

	// Restart Generation after certain seconds
	setInterval(() => {
		generation.evolve();
	}, generationPeriod * 1000);

	// Run the renderer
	let render = Render.create({
		engine: engine,
		element: document.body,
		options: {
			height, width
		}
	});
	Render.run(render);

	// Mouse Constraint
	let canvasMouse = Matter.Mouse.create(canvas.elt);
	canvasMouse.pixelRatio = pixelDensity();
	let m = Matter.MouseConstraint.create(engine, { mouse: canvasMouse });
	Matter.World.add(world, m);

	let renderMouse = Matter.Mouse.create(render.canvas);
	renderMouse.pixelRatio = pixelDensity();
	Matter.World.add(world, Matter.MouseConstraint.create(engine, {
		mouse: renderMouse
	}));

	// Think every 50ms
	setInterval(() => {
		generation.species.forEach((creature) => {
			creature.think(boundary);
		});
	}, 50)
}