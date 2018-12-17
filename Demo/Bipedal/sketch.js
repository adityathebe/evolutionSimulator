const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;

function setup() {
	let canvas = createCanvas(windowWidth * 0.95, windowHeight * 0.95);

	// Initialize Generation
	const bipedal = new Bipedal({
		leftLegLength: 60,
		rightLegLength: 60,
		bodyLength: 100,
		leftLegWidth: 10,
		rightLegWidth: 10,
		bodyWidth: 20,
		posX: width * 0.1,
		posY: height * 0.80,
	});
	bipedal.addToWorld(world);

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