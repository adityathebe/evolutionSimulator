const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;
let leggy, boundary;
let leftMuscleSlider, rightMuscleSlider, bodyLeftLegMuscleSlider, bodyRightLegMuscleSlider;

function draw() {
	background(54)
	leggy.leftMuscle.length = leftMuscleSlider.value();
	leggy.rightMuscle.length = rightMuscleSlider.value();
	leggy.bodyLeftLegMuscle.length = bodyLeftLegMuscleSlider.value();
	leggy.bodyRightLegMuscle.length = bodyRightLegMuscleSlider.value();

	// Display Angle
	textSize(20);
	text('Lower Left: ' + leggy.lowerLeftLeg.angle.toFixed(2), 0, height * 0.95);
	text('Upper Left: ' + leggy.upperLeftLeg.angle.toFixed(2), 200, height * 0.95);
	text('Lower Right: ' + leggy.lowerRightLeg.angle.toFixed(2), 400, height * 0.95);
	text('Upper Right: ' + leggy.upperRightLeg.angle.toFixed(2), 600, height * 0.95);
	text('Backbone: ' + leggy.backbone.angle.toFixed(2), 800, height * 0.95 );

	// Display Length
	text('Body Left: ' + leggy.bodyLeftLegMuscle.length.toFixed(2), 0, height);
	text('Body Right: ' + leggy.bodyRightLegMuscle.length.toFixed(2), 200, height);
	text('Leg Left: ' + leggy.leftMuscle.length.toFixed(2), 400, height);
	text('Leg Right: ' + leggy.rightMuscle.length.toFixed(2), 600, height);
}

function setup() {
	fill(100);
	let canvas = createCanvas(1240, 600);

	// Initialize Generation
	leggy = new Person();
	leggy.addToWorld(world);

	// Boundary
	boundary = new SimpleBoundary();
	boundary.addToWorld(world);

	// Run Engine
	Matter.Engine.run(engine);
	const render = Render.create({
		engine: engine,
		element: document.body,
		options: {
			width,
			height,
			// wireframes: false,
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

	// Sliders
	leftMuscleSlider = createSlider(25, 45, 45, 1);
	rightMuscleSlider = createSlider(25, 45, 45, 1);
	bodyLeftLegMuscleSlider = createSlider(30, 60, leggy.bodyLeftLegMuscle.length, 1);
	bodyRightLegMuscleSlider = createSlider(30, 60, leggy.bodyRightLegMuscle.length, 1);

}