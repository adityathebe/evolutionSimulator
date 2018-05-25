class Person {
	constructor(params) {
		this.upper_length = params.upper_length;
		this.upper_width = params.upper_width;
		this.lower_length = params.lower_length;;
		this.lower_width = params.lower_width;
		this.score = 1;
		this.x = params.x;
		this.y = params.y;
		this.upper_left_leg = Matter.Bodies.rectangle(params.x, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.2,
			density: 0.001,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			}
		});
		this.lower_left_leg = Matter.Bodies.rectangle(params.x, params.y + params.upper_length, params.lower_width, params.lower_length, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 0.8,
			density: 0.001,
			restitution: 0.2,
		});
		this.upper_right_leg = Matter.Bodies.rectangle(params.x, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.2,
			density: 0.001,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.lower_right_leg = Matter.Bodies.rectangle(params.x, params.y + params.upper_length, params.lower_width, params.lower_length, {
			friction: 0.8,
			restitution: 0.2,
			density: 0.001,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.params = params;

		// Neural Network
		if (params.brain) {
			this.brain = params.brain;
		} else {
			this.brain = new NeuralNetwork(4, 10, 3);;
		}

		this.init();
	}

	init() {

		this.left_joint = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.lower_left_leg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.right_joint = Matter.Constraint.create({
			bodyA: this.upper_right_leg,
			bodyB: this.lower_right_leg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.main_joint = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.upper_right_leg,
			pointA: { x: 0, y: -this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		// Muscle Joints
		this.main_muscle = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.upper_right_leg,
			length: (this.upper_length / 2),
			stiffness: 1,
		});

		this.left_muscle = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.lower_left_leg,
			length: (this.upper_length / 3) + (this.lower_length / 3),
			stiffness: 1
		});

		this.right_muscle = Matter.Constraint.create({
			bodyA: this.upper_right_leg,
			bodyB: this.lower_right_leg,
			length: (this.upper_length / 3) + (this.lower_length / 3),
			stiffness: 1
		});
	}

	kill(world) {
		Matter.World.remove(world, this.upper_right_leg);
		Matter.World.remove(world, this.upper_left_leg);
		Matter.World.remove(world, this.lower_left_leg);
		Matter.World.remove(world, this.lower_right_leg);

		// Remove Joints
		Matter.World.remove(world, this.left_joint);
		Matter.World.remove(world, this.right_joint);
		Matter.World.remove(world, this.main_joint);
		
		// Remove Muscles
		Matter.World.remove(world, this.main_muscle);
		Matter.World.remove(world, this.left_muscle);
		Matter.World.remove(world, this.right_muscle);

		// Dispose the tensors in its brain
		this.brain.input_weights.dispose();
		this.brain.output_weights.dispose();
	}

	add_to_world(world) {
		Matter.World.add(world, this.upper_right_leg);
		Matter.World.add(world, this.upper_left_leg);
		Matter.World.add(world, this.lower_left_leg);
		Matter.World.add(world, this.lower_right_leg);

		// Remove Joints
		Matter.World.add(world, this.left_joint);
		Matter.World.add(world, this.right_joint);
		Matter.World.add(world, this.main_joint);

		// Remove Muscles
		Matter.World.add(world, this.main_muscle);
		Matter.World.add(world, this.left_muscle);
		Matter.World.add(world, this.right_muscle);
	}

	show() {
		fill(color(154, 10, 10, 160))
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.upper_left_leg.vertices[i].x, this.upper_left_leg.vertices[i].y);
		}
		endShape();

		fill(color(255,255,10, 160))
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.upper_right_leg.vertices[i].x, this.upper_right_leg.vertices[i].y);
		}
		endShape();

		fill(color(154, 10, 10, 160))
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.lower_left_leg.vertices[i].x, this.lower_left_leg.vertices[i].y);
		}
		endShape();

		fill(color(255,255,10, 160))
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.lower_right_leg.vertices[i].x, this.lower_right_leg.vertices[i].y);
		}
		endShape();
	}

	// Movements
	move_m1(change) {
		let max = this.upper_length;
		let temp = change * max * 0.80;
		this.main_muscle.length = temp
	}

	move_m2(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2);
		let temp = change * max * 0.80 + ( max * 0.20 );
		this.left_muscle.length = temp;
	}

	move_m3(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2)
		let temp = change * max * 0.80 + ( max * 0.20 );
		this.right_muscle.length = temp;
	}

	adjust_score() {
		let score = this.upper_left_leg.position.x - this.x;
		this.score = score > 0 ? score : 0;
	}

	think(boundary) {
		let ground = boundary.ground;
		let distance_from_ground = ground.position.y - ((this.upper_left_leg.position.y + this.upper_right_leg.position.y + this.lower_right_leg.position.y + this.lower_left_leg.position.y) / 4)
		let torque = this.upper_left_leg.angularVelocity + this.upper_right_leg.angularVelocity + this.lower_right_leg.angularVelocity + this.lower_left_leg.angularVelocity;
		let vx = this.upper_left_leg.velocity.x + this.upper_right_leg.velocity.x + this.lower_right_leg.velocity.x + this.lower_left_leg.velocity.x;
		let vy = this.upper_left_leg.velocity.y + this.upper_right_leg.velocity.y + this.lower_right_leg.velocity.y + this.lower_left_leg.velocity.y;
		let input = [distance_from_ground / width, vx / 4, vy / 4, torque / 4];

		let result = this.brain.predict(input);

		this.move_m1(result[0]);
		this.move_m2(result[1]);
		this.move_m3(result[2]);
	}

	clone() {
		return new Person(this.params);
	}

	mutate() {
		function fn(x) {
			if (random(1) < 0.05) {
				let offset = randomGaussian() * 0.5;
				let newx = x + offset;
				return newx;
			}
			return x;
		}

		let ih = this.brain.input_weights.dataSync().map(fn);
		let ih_shape = this.brain.input_weights.shape;
		this.brain.input_weights = tf.tensor(ih, ih_shape);

		let ho = this.brain.output_weights.dataSync().map(fn);
		let ho_shape = this.brain.output_weights.shape;
		this.brain.output_weights = tf.tensor(ho, ho_shape);
	}

	crossover(partner) {
		let parentA_dna = this.brain.input_weights.dataSync();
		let parentB_dna = partner.brain.input_weights.dataSync();
		let parents = [parentA_dna, parentB_dna];

		let child_dna = [];
		for (let i = 0; i < parentA_dna.length; i++) {
			let select = Math.floor(Math.random() * 2);
			child_dna.push(parents[select][i]);
		}
		let child = this.clone();
		child.brain.input_weights = tf.tensor(child_dna, this.brain.input_weights.shape);
		return child;
	}

	walk() {
		setInterval(() => {
			this.think(boundary)
		}, 100)
	}
}