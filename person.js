class Person {
	constructor(upper_length, upper_width, lower_length, lower_width, x, y) {
		this.upper_length = upper_length;
		this.upper_width = upper_width;
		this.lower_length = lower_length;
		this.lower_width = lower_width;
		this.upper_left_leg = Matter.Bodies.rectangle(x, y, upper_width, upper_length, {
			friction: 0.8,
			restitution: 0.2,
			density: 0.001,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			}
		});
		this.lower_left_leg = Matter.Bodies.rectangle(x, y + upper_length, lower_width, lower_length, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 0.8,
			density: 0.001,
			restitution: 0.2,
		});
		this.upper_right_leg = Matter.Bodies.rectangle(x, y, upper_width, upper_length, {
			friction: 0.8,
			restitution: 0.2,
			density: 0.001,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.lower_right_leg = Matter.Bodies.rectangle(x, y + upper_length, lower_width, lower_length, {
			friction: 0.8,
			restitution: 0.2,
			density: 0.001,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		// Neural Network
		this.brain = new NeuralNetwork(5, 10, 3);
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

	show() {
		fill('green')
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.upper_left_leg.vertices[i].x, this.upper_left_leg.vertices[i].y);
		}
		endShape();

		fill('red')
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.upper_right_leg.vertices[i].x, this.upper_right_leg.vertices[i].y);
		}
		endShape();

		fill('green');
		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.lower_left_leg.vertices[i].x, this.lower_left_leg.vertices[i].y);
		}
		endShape();
		fill('red')

		beginShape();
		for (let i = 0; i < 4; i++) {
			vertex(this.lower_right_leg.vertices[i].x, this.lower_right_leg.vertices[i].y);
		}
		endShape();
	}

	// Movements
	move_m1(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2);
		let temp = this.main_muscle.length + (change * max);
		if (temp >= max) return false;
		if (temp <= 0.01) return false;
		this.main_muscle.length = temp
	}

	move_m2(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2);
		let temp = this.left_muscle.length + ( change * max );
		if (temp <= 0.01) return false;
		if (temp >= max) return false;
		this.left_muscle.length = temp;
	}

	move_m3(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2)
		let temp = this.right_muscle.length + (change * max);
		if (temp <= 0.01) return false;
		if (temp >= max) return false;
		this.right_muscle.length = temp;
	}

	think() {
		let distance_from_ground = ground.position.y - ((creatures[0].upper_left_leg.position.y + creatures[0].upper_right_leg.position.y + creatures[0].lower_right_leg.position.y + creatures[0].lower_left_leg.position.y) / 4)
		let torque = this.upper_left_leg.angularVelocity + this.upper_right_leg.angularVelocity + this.lower_right_leg.angularVelocity + this.lower_left_leg.angularVelocity;
		let angle = this.upper_left_leg.angle + this.upper_right_leg.angle + this.lower_right_leg.angle + this.lower_left_leg.angle;
		let vx = this.upper_left_leg.velocity.x + this.upper_right_leg.velocity.x + this.lower_right_leg.velocity.x + this.lower_left_leg.velocity.x;
		let vy = this.upper_left_leg.velocity.y + this.upper_right_leg.velocity.y + this.lower_right_leg.velocity.y + this.lower_left_leg.velocity.y;
		let input = [distance_from_ground / width, vx / 4, vy / 4, torque / 4, angle / (4 * PI)];

		// let ground_touch = 
		let result = this.brain.predict(input).dataSync();

		this.move_m1(result[0])
		this.move_m2(result[1])
		this.move_m3(result[2])

		// console.log(input)
		console.log(result)
	}

	walk() {
		setInterval(() => {
			this.think()
		}, 200)
	}
}


ground.position.y - ((creatures[0].upper_left_leg.position.y + creatures[0].upper_right_leg.position.y + creatures[0].lower_right_leg.position.y + creatures[0].lower_left_leg.position.y) / 4)