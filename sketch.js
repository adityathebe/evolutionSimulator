let boundary;
let creatures = []

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;
const generationPeriod = 25;
let generation = new Generation(20);

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);

	// Initialize Generation
	generation.initialize(Leggy);
	generation.species.forEach((creature) => { creature.addToWorld(world) });

	// Boundary
	boundary = new SimpleBoundary();
	boundary.addToWorld(world);

	// Run Engine
	Matter.Engine.run(engine);

	// Restart Generation after certain seconds
	let settled = false;
	setTimeout(() => settled = true, 1000);
	setInterval(() => {
		settled = false;
		generation.evolve();
		setTimeout(() => settled = true, 1000);
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

	// Think every 80 ms
	setInterval(() => {
		generation.species.forEach((creature) => {
			if (settled) creature.think(boundary);
		});
	}, 80)
}