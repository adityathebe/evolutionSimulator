class LeggyJumper {

	constructor(params = {}) {
		this.id = params.id || 0;
		this.upper_length = params.upper_length || 40;
		this.upper_width = params.upper_width || 15;
		this.lower_length = params.lower_length || 30;
		this.lower_width = params.lower_width || 10;
		this.score = 0;
		this.fitness = 0;
		this.x = params.x || width * 0.10;
		this.y = params.y || height * 0.80;
		this.brain = new NeuralNetwork(12, 25, 3);
		this.upperRightLeg = Matter.Bodies.rectangle(this.x * 0.90, this.y, this.upper_width, this.upper_length, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: false,
		});
		this.lowerRightLeg = Matter.Bodies.rectangle(this.x * 0.90, this.y + this.upper_length, this.lower_width, this.lower_length, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 1,
			density: 0.05,
			restitution: 0.1,
			isStatic: false,
		});
		this.upperLeftLeg = Matter.Bodies.rectangle(this.x, this.y, this.upper_width, this.upper_length, {
			friction: 1,
			restitution: 0.1,
			isStatic: false,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.lowerLeftLeg = Matter.Bodies.rectangle(this.x, this.y + this.upper_length, this.lower_width, this.lower_length, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			isStatic: false,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		this.init();
	}

	init() {
		let selected_color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
		this.colors = [selected_color, selected_color];

		this.left_joint = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.lowerLeftLeg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.right_joint = Matter.Constraint.create({
			bodyA: this.upperRightLeg,
			bodyB: this.lowerRightLeg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.main_joint = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.upperRightLeg,
			pointA: { x: 0, y: -this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		// Muscle Joints
		this.main_muscle = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.upperRightLeg,
			length: (this.upper_length / 2),
			stiffness: 1,
		});

		this.left_muscle = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.lowerLeftLeg,
			length: (this.upper_length / 2) + (this.lower_length / 2),
			stiffness: 1
		});

		this.right_muscle = Matter.Constraint.create({
			bodyA: this.upperRightLeg,
			bodyB: this.lowerRightLeg,
			length: (this.upper_length / 2) + (this.lower_length / 2),
			stiffness: 1
		});
	}

	/**
	 * Adds all parts of the person in MatterJS world
	 * @param {Matter.World} world 
	 */
	addToWorld(world) {
		Matter.World.add(world, [this.upperRightLeg, this.upperLeftLeg, this.lowerLeftLeg, this.lowerRightLeg]);
		Matter.World.add(world, [this.main_joint]);
		Matter.World.add(world, [this.left_joint, this.right_joint]);
		Matter.World.add(world, [this.main_muscle, this.left_muscle, this.right_muscle]);
	}

	/**
	 * Removes all parts of the person from MatterJS world
	 * @param {Matter.World} world 
	 */
	removeFromWorld(world) {
		Matter.World.remove(world, [this.upperRightLeg, this.upperLeftLeg, this.lowerLeftLeg, this.lowerRightLeg,
		this.left_joint, this.right_joint, this.main_joint, this.main_muscle, this.left_muscle, this.right_muscle]);

		// Dispose its brain
		this.brain.dispose();
	}

	/**
   * Returns an object of with all the parameters required to create a new Bipedal
   * @returns {Object}
   */
	getParams() {
		return Object.assign({}, {
			upper_length: this.upper_length,
			upper_width: this.upper_width,
			lower_length: this.lower_length,
			lower_width: this.lower_width,
			x: this.x,
			y: this.y,
			id: this.id,
		});
	}

	/** Displays the matterJS bodies in p5.js canvas */
	show() {
		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.upperLeftLeg.vertices[i].x, this.upperLeftLeg.vertices[i].y);
		}
		endShape();

		fill(this.colors[1])
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.upperRightLeg.vertices[i].x, this.upperRightLeg.vertices[i].y);
		}
		endShape();

		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.lowerLeftLeg.vertices[i].x, this.lowerLeftLeg.vertices[i].y);
		}
		endShape();

		fill(this.colors[1])
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.lowerRightLeg.vertices[i].x, this.lowerRightLeg.vertices[i].y);
		}
		endShape();
	}

	adjustScore() {
		const lowerLeftLegTouchesGround = (boundary.ground.bounds.min.y - this.lowerLeftLeg.bounds.max.y) < 1;
		const upperLeftLegTouchesGround = (boundary.ground.bounds.min.y - this.upperLeftLeg.bounds.max.y) < 1;
		const lowerRightLegTouchesGround = (boundary.ground.bounds.min.y - this.lowerRightLeg.bounds.max.y) < 1;
		const upperRightLegTouchesGround = (boundary.ground.bounds.min.y - this.upperRightLeg.bounds.max.y) < 1;
		const jumpingScore =
			(this.lowerLeftLeg.position.y * this.lowerLeftLeg.velocity.y * (lowerLeftLegTouchesGround ? 2 : 0.5)) +
			(this.upperLeftLeg.position.y * this.upperLeftLeg.velocity.y * (upperLeftLegTouchesGround ? 4 : 0.1)) +
			(this.lowerRightLeg.position.y * this.lowerRightLeg.velocity.y * (lowerRightLegTouchesGround ? 2 : 0.5)) +
			(this.upperRightLeg.position.y * this.upperRightLeg.velocity.y * (upperRightLegTouchesGround ? 4 : 0.1));
		this.score += jumpingScore;
	}

	///////////////////////////
	// Neural Network Stuffs //
	///////////////////////////
	think() {
		const heightLowerLeftLeg = this.lowerLeftLeg.position.y / width;
		const heightUpperLeftLeg = this.upperLeftLeg.position.y / width;
		const heightLowerRighttLeg = this.lowerRightLeg.position.y / width;
		const heightUpperRightLeg = this.upperRightLeg.position.y / width;

		const angleLowerLeftLeg = this.lowerLeftLeg.angle;
		const angleUpperLeftLeg = this.upperLeftLeg.angle;
		const angleLowerRighttLeg = this.lowerRightLeg.angle;
		const angleUpperRightLeg = this.upperRightLeg.angle;

		const vyLowerLeftLeg = this.lowerLeftLeg.velocity.y;
		const vyUpperLeftLeg = this.upperLeftLeg.velocity.y;
		const vyLowerRighttLeg = this.lowerRightLeg.velocity.y;
		const vyUpperRightLeg = this.upperRightLeg.velocity.y;

		const result = this.brain.predict([
			heightLowerLeftLeg,
			heightUpperLeftLeg,
			heightLowerRighttLeg,
			heightUpperRightLeg,
			angleLowerLeftLeg,
			angleUpperLeftLeg,
			angleLowerRighttLeg,
			angleUpperRightLeg,
			vyLowerLeftLeg,
			vyUpperLeftLeg,
			vyLowerRighttLeg,
			vyUpperRightLeg,
		]);

		// Move Muscles
		const mainMuscleShift = result[0] > 0.5 ? 3 : -3;
		const leftMuscleShift = result[0] > 0.5 ? 3 : -3;
		const rightMuscleShift = result[1] > 0.5 ? 3 : -3;

		const maxLegMuscleLength = ((this.upper_length / 2) + (this.lower_length / 2));
		const maxMainMuscleLength = (this.upper_length / 2);
		if (this.left_muscle.length + leftMuscleShift <= maxLegMuscleLength && this.left_muscle.length + leftMuscleShift >= 20)
			this.left_muscle.length += leftMuscleShift;
		if (this.right_muscle.length + rightMuscleShift <= maxLegMuscleLength && this.right_muscle.length + rightMuscleShift > 20)
			this.right_muscle.length += rightMuscleShift;
		if (this.main_muscle.length + mainMuscleShift <= maxMainMuscleLength && this.main_muscle.length + mainMuscleShift > 10)
			this.main_muscle.length += mainMuscleShift;

		// Adjust Score
		this.adjustScore()
	}

	mutate() {
		function fn(x) {
			if (random(1) < 0.1) {
				let offset = randomGaussian() * 0.5;
				let newx = x + offset;
				return newx;
			}
			return x;
		}

		let ih = this.brain.input_weights.dataSync().map(fn);
		let ih_shape = this.brain.input_weights.shape;
		this.brain.input_weights.dispose();
		this.brain.input_weights = tf.tensor(ih, ih_shape);

		let ho = this.brain.output_weights.dataSync().map(fn);
		let ho_shape = this.brain.output_weights.shape;
		this.brain.output_weights.dispose();
		this.brain.output_weights = tf.tensor(ho, ho_shape);
	}

	crossover(partner) {
		let parentA_in_dna = this.brain.input_weights.dataSync();
		let parentA_out_dna = this.brain.output_weights.dataSync();
		let parentB_in_dna = partner.brain.input_weights.dataSync();
		let parentB_out_dna = partner.brain.output_weights.dataSync();

		let mid = Math.floor(Math.random() * parentA_in_dna.length);
		let child_in_dna = [...parentA_in_dna.slice(0, mid), ...parentB_in_dna.slice(mid, parentB_in_dna.length)];
		let child_out_dna = [...parentA_out_dna.slice(0, mid), ...parentB_out_dna.slice(mid, parentB_out_dna.length)];

		let child = this.clone();
		let input_shape = this.brain.input_weights.shape;
		let output_shape = this.brain.output_weights.shape;

		child.brain.dispose();

		child.brain.input_weights = tf.tensor(child_in_dna, input_shape);
		child.brain.output_weights = tf.tensor(child_out_dna, output_shape);

		return child;
	}

	clone() {
		let leggy = new LeggyJumper(this.getParams());
		leggy.brain = this.brain.clone();
		return leggy;
	}
}