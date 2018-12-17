let staticVar = false;

class Leggy {
	/**
	 * Takes in a object with properties : id, x, y upper_length, lower_length, upper_width, lower_width,
	 * @constructor
	 */
	constructor(params) {
		this.id = params.id;
		this.upper_length = params.upper_length;
		this.upper_width = params.upper_width;
		this.lower_length = params.lower_length;;
		this.lower_width = params.lower_width;
		this.score = 0;
		this.fitness = 0;
		this.colors = [];
		this.params = params;
		this.brain = new NeuralNetwork(4, 10, 2);
		this.upperLeftLeg = Matter.Bodies.rectangle(params.x, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});
		this.lowerLeftLeg = Matter.Bodies.rectangle(params.x * 0.90, params.y, params.lower_width, params.lower_length, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 0.8,
			density: 0.05,
			restitution: 0.1,
			isStatic: staticVar,
		});
		this.upperRightLeg = Matter.Bodies.rectangle(params.x, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.1,
			isStatic: staticVar,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.lowerRightLeg = Matter.Bodies.rectangle(params.x, params.y, params.lower_width, params.lower_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			isStatic: staticVar,
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
			stiffness: 0.,
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
			length: ((this.upper_length / 3) + (this.lower_length / 3)) * 1.5,
			stiffness: 1
		});

		this.right_muscle = Matter.Constraint.create({
			bodyA: this.upperRightLeg,
			bodyB: this.lowerRightLeg,
			length: 1.5 * ((this.upper_length / 3) + (this.lower_length / 3)),
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
		const walkingScore = this.upperLeftLeg.position.x - this.params.x;
		const isBalanced = this.upperLeftLeg.position.y < this.lowerLeftLeg.position.y
			&& this.upperRightLeg.position.y < this.lowerRightLeg.position.y;
		this.score += walkingScore * (isBalanced ? 1 : 0.50);
	}

	///////////////////////////
	// Neural Network Stuffs //
	///////////////////////////
	think(boundary) {
		let ground = boundary.ground;
		let distance_from_ground = ground.position.y - ((this.upperLeftLeg.position.y + this.upperRightLeg.position.y + this.lowerRightLeg.position.y + this.lowerLeftLeg.position.y) / 4)
		let torque = this.upperLeftLeg.angularVelocity + this.upperRightLeg.angularVelocity + this.lowerRightLeg.angularVelocity + this.lowerLeftLeg.angularVelocity;
		let vx = this.upperLeftLeg.velocity.x + this.upperRightLeg.velocity.x + this.lowerRightLeg.velocity.x + this.lowerLeftLeg.velocity.x;
		let vy = this.upperLeftLeg.velocity.y + this.upperRightLeg.velocity.y + this.lowerRightLeg.velocity.y + this.lowerLeftLeg.velocity.y;
		let input = [distance_from_ground / width, vx / 4, vy / 4, torque / 4];

		let result = this.brain.predict(input);
		
		// Move Muscles
		const mainMuscleShift = result[0] > 0.5 ? 3 : -3;
		const leftMuscleShift = result[0] > 0.5 ? 3 : -3;
		const rightMuscleShift = result[1] > 0.5 ? 3 : -3;

		if (this.left_muscle.length + leftMuscleShift < 50 && this.left_muscle.length + leftMuscleShift > 15)
			this.left_muscle.length += leftMuscleShift;
		if (this.right_muscle.length + rightMuscleShift < 50 && this.right_muscle.length + rightMuscleShift  > 15)
			this.right_muscle.length += rightMuscleShift;
		if (this.main_muscle.length + mainMuscleShift < 35 && this.main_muscle.length + mainMuscleShift > 10)
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
		let params = Object.assign({}, this.params);
		let leggy = new Leggy(params);
		leggy.brain.dispose();
		leggy.brain = this.brain.clone();
		return leggy;
	}

	walk() {
		setInterval(() => {
			this.think(boundary)
		}, 100)
	}
}

/**
 * Quantizes the muscle movement.
 * @param {number} change - Accepts number between 0 and 1
 * @returns {number} Returns either 0.5 or 1.
 */
function muscleMapper(change) {
	if (change > 1) return null;
	if (change < 0.5) return 0.5;
	else return 1;

	// if (change < 0.33) return 0.33 ;
	// else if (change < 0.67) return 0.67;
	// else if (change < 1) return 0.90;
}