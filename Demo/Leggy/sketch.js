const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;

function setup() {
	let canvas = createCanvas(windowWidth * 0.95, windowHeight * 0.95);

	// Initialize Generation
	const leggy = new Leggy({
		upper_length: 30,
		upper_width: 8,
		lower_length: 30,
		lower_width: 6,
		x: width * 0.15,
		y: height * 0.85,
		id: 1
	});
	leggy.addToWorld(world);

	// Boundary
	const boundary = new SimpleBoundary();
	boundary.add_to_world(world);

	// Run Engine
	Matter.Engine.run(engine);
	const render = Render.create({
		engine: engine,
		element: document.body,
		options: {
			height, width
		}
	});
	Render.run(render);

	// Mouse Constraint
	const canvasMouse = Matter.Mouse.create(canvas.elt);
	canvasMouse.pixelRatio = pixelDensity();
	const m = Matter.MouseConstraint.create(engine, { mouse: canvasMouse });
	Matter.World.add(world, m);

	const renderMouse = Matter.Mouse.create(render.canvas);
	renderMouse.pixelRatio = pixelDensity();
	Matter.World.add(world, Matter.MouseConstraint.create(engine, {
		mouse: renderMouse
	}));
}