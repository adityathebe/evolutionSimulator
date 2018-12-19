let staticVar = false;

class Leggy {
	
	constructor(params = {}) {
		this.id = params.id || 0;
		this.upper_length = params.upper_length || 40;
		this.upper_width = params.upper_width || 15;
		this.lower_length = params.lower_length || 30;
		this.lower_width = params.lower_width || 10;
		this.backboneWidth = params.backboneWidth || 30;
		this.backboneLength = params.backboneLength || 60;
		this.footLength = 15;
		this.footWidth = 20;
		this.score = 0;
		this.fitness = 0;
		this.x = width * 0.10;
		this.y = height * 0.75;
		this.brain = new NeuralNetwork(10, 50, 4);
		this.legBodyMuscleRestLength = Math.sqrt((this.backboneWidth * this.backboneWidth) + (this.upper_length * this.upper_length))

		this.leftFoot = Matter.Bodies.rectangle(this.x + (this.footWidth / 2), this.y + this.upper_length + this.lower_length + this.backboneLength / 2, this.footWidth, this.footLength, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.rightFoot = Matter.Bodies.rectangle(this.x - (this.footWidth), this.y + this.upper_length + this.lower_length + this.backboneLength / 2, this.footWidth, this.footLength, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.upperRightLeg = Matter.Bodies.rectangle(this.x + (this.backboneWidth / 2), this.y + this.upper_length / 2 + this.backboneLength / 2, this.upper_width, this.upper_length, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.lowerRightLeg = Matter.Bodies.rectangle(this.x + (this.backboneWidth / 2), this.y + this.upper_length + this.backboneLength / 2 + this.lower_length / 2, this.lower_width, this.lower_length, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 1,
			density: 0.05,
			restitution: 0.1,
			isStatic: staticVar,
		});

		this.upperLeftLeg = Matter.Bodies.rectangle(this.x + (this.backboneWidth /2), this.y + this.upper_length / 2 + this.backboneLength / 2, this.upper_width, this.upper_length, {
			friction: 1,
			restitution: 0.1,
			isStatic: staticVar,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		this.lowerLeftLeg = Matter.Bodies.rectangle(this.x + (this.backboneWidth / 2), this.y + this.upper_length + this.backboneLength / 2 + this.lower_length/2, this.lower_width, this.lower_length, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			isStatic: staticVar,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		this.backbone = Matter.Bodies.rectangle(this.x, this.y, this.backboneWidth, this.backboneLength, {
			friction: 1,
			restitution: 0.1,
			density: 0.05,
			// isStatic: true,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		this.connectBones();
		this.connectMuscles();
	}

	connectBones() {
		this.leftFootJoint = Matter.Constraint.create({
			bodyA: this.leftFoot,
			bodyB: this.lowerLeftLeg,
			pointA: { x: -this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: this.lower_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.rightFootJoint = Matter.Constraint.create({
			bodyA: this.rightFoot,
			bodyB: this.lowerRightLeg,
			pointA: { x: -this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: this.lower_length / 2 },
			length: 0,
			stiffness: 1,
		});

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

		this.leftMainJoint = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperLeftLeg,
			pointA: { x: this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.rightMainJoint = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperRightLeg,
			pointA: { x: this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});
	}

	connectMuscles() {

		this.leftFootMuscle = Matter.Constraint.create({
			bodyA: this.leftFoot,
			bodyB: this.lowerLeftLeg,
			length: 20,
			pointA: { x: this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: 0 },
			stiffness: 1,
			damping: 0,
		});

		this.rightFootMuscle = Matter.Constraint.create({
			bodyA: this.rightFoot,
			bodyB: this.lowerRightLeg,
			length: 20,
			pointA: { x: this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: 0 },
			stiffness: 1,
			damping: 0,
		});

		this.bodyLeftLegMuscle = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperLeftLeg,
			length: this.legBodyMuscleRestLength + 10,
			pointA: { x: -this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: this.upper_length / 2 },
			stiffness: 1,
			damping: 0,
		});

		this.bodyRightLegMuscle = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperRightLeg,
			length: this.legBodyMuscleRestLength - 10,
			pointA: { x: -this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: this.upper_length / 2 },
			stiffness: 1,
			damping: 0,
		});

		this.left_muscle = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.lowerLeftLeg,
			pointB: { x: 0, y: this.lower_length / 2 },
			length: (this.upper_length / 2) + this.lower_length,
			stiffness: 1,
			damping: 0,
		});

		this.right_muscle = Matter.Constraint.create({
			bodyA: this.upperRightLeg,
			bodyB: this.lowerRightLeg,
			pointB: { x: 0, y: this.lower_length / 2 },
			length: (this.upper_length / 2) + this.lower_length,
			stiffness: 1,
			damping: 0,
		});
	}

	/**
	 * Adds all parts of the person in MatterJS world
	 * @param {Matter.World} world 
	 */
	addToWorld(world) {

		// Body Compmonents
		Matter.World.add(world, [this.upperRightLeg, this.upperLeftLeg, this.lowerLeftLeg, this.lowerRightLeg]);
		Matter.World.add(world, [this.backbone, this.leftFoot, this.rightFoot]);

		// Bones Joints
		Matter.World.add(world, [this.rightMainJoint, this.leftMainJoint]);
		Matter.World.add(world, [this.left_joint, this.right_joint]);
		Matter.World.add(world, [this.leftFootJoint, this.rightFootJoint]);

		// Muscles
		Matter.World.add(world, [this.left_muscle, this.right_muscle]);
		Matter.World.add(world, [this.bodyLeftLegMuscle, this.bodyRightLegMuscle]);
		Matter.World.add(world, [this.leftFootMuscle, this.rightFootMuscle]);
	}

	/**
	 * Removes all parts of the person from MatterJS world
	 * @param {Matter.World} world 
	 */
	removeFromWorld(world) {
		// Body Compmonents
		Matter.World.remove(world, [this.upperRightLeg, this.upperLeftLeg, this.lowerLeftLeg, this.lowerRightLeg]);
		Matter.World.remove(world, [this.backbone, this.leftFoot, this.rightFoot]);

		// Bones Joints
		Matter.World.remove(world, [this.rightMainJoint, this.leftMainJoint]);
		Matter.World.remove(world, [this.left_joint, this.right_joint]);
		Matter.World.remove(world, [this.leftFootJoint, this.rightFootJoint]);

		// Muscles
		Matter.World.remove(world, [this.left_muscle, this.right_muscle]);
		Matter.World.remove(world, [this.bodyLeftLegMuscle, this.bodyRightLegMuscle]);
		Matter.World.remove(world, [this.leftFootMuscle, this.rightFootMuscle]);


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
			backboneLength: this.backboneLength,
			backboneWidth: this.backboneWidth,
			x: this.x,
			y: this.y,
			id: this.id,
		});
	}

	adjustScore() {
		const walkingScore = this.backbone.position.x// - this.backbone.positionPrev.x;
		const isBackboneBalanced = Math.abs(this.backbone.angle) < 0.40;
		const isLowerLeftLegBalanced = this.lowerLeftLeg.angle >= 0.4 && this.lowerLeftLeg.angle <= 1;
		const isLowerRightLegBalanced = this.lowerRightLeg.angle >= 0.4 && this.lowerRightLeg.angle <= 1;
		const isUpperLeftLegBalanced = Math.abs(this.lowerLeftLeg.angle) < 0.45;
		const isUpperRightLegBalanced = Math.abs(this.lowerRightLeg.angle) < 0.45;
		this.score += walkingScore
			* (isLowerLeftLegBalanced && isUpperLeftLegBalanced ? 2 : 0.50)
			// * (isUpperLeftLegBalanced ? 2 : 0.50)
			* (isLowerRightLegBalanced && isUpperRightLegBalanced? 2 : 0.50)
			// * (isUpperRightLegBalanced ? 2 : 0.50)
			* (isBackboneBalanced ? 3 : 0.50)
	}

	///////////////////////////
	// Neural Network Stuffs //
	///////////////////////////
	think() {
		const heightLowerLeftLeg = this.lowerLeftLeg.position.y / width;
		const heightUpperLeftLeg = this.upperLeftLeg.position.y / width;
		const heightLowerRighttLeg = this.lowerRightLeg.position.y / width;
		const heightUpperRightLeg = this.upperRightLeg.position.y / width;
		const heightBackbone = this.backbone.position.y / width;

		const angleLowerLeftLeg = this.lowerLeftLeg.angle;
		const angleUpperLeftLeg = this.upperLeftLeg.angle;
		const angleLowerRighttLeg = this.lowerRightLeg.angle;
		const angleUpperRightLeg = this.upperRightLeg.angle;
		const angleBackbone = this.backbone.angle;

		const vxLowerLeftLeg = this.lowerLeftLeg.velocity.x;
		const vxUpperLeftLeg = this.upperLeftLeg.velocity.x;
		const vxLowerRighttLeg = this.lowerRightLeg.velocity.x;
		const vxUpperRightLeg = this.upperRightLeg.velocity.x;
		const vxBackbone = this.backbone.velocity.x;

		const vyLowerLeftLeg = this.lowerLeftLeg.velocity.y;
		const vyUpperLeftLeg = this.upperLeftLeg.velocity.y;
		const vyLowerRightLeg = this.lowerRightLeg.velocity.y;
		const vyUpperRightLeg = this.upperRightLeg.velocity.y;
		const vyBackbone = this.backbone.velocity.y;

		const result = this.brain.predict([
			heightLowerLeftLeg,
			heightUpperLeftLeg,
			heightLowerRighttLeg,
			heightUpperRightLeg,
			heightBackbone,
			angleLowerLeftLeg,
			angleUpperLeftLeg,
			angleLowerRighttLeg,
			angleUpperRightLeg,
			angleBackbone,
			// vxLowerLeftLeg,
			// vxUpperLeftLeg,
			// vxLowerRighttLeg,
			// vxUpperRightLeg,
			// vxBackbone,
			// vyLowerLeftLeg,
			// vyUpperLeftLeg,
			// vyLowerRightLeg,
			// vyUpperRightLeg,
			// vyBackbone,
		]);

		// Move Muscles
		const leftMuscleShift = result[0] > 0.5 ? 3 : -3;
		const rightMuscleShift = result[1] > 0.5 ? 3 : -3;
		const bodyLeftLegShift = result[2] > 0.5 ? 3 : -3;
		const bodyRightLegShift = result[3] > 0.5 ? 3 : -3;

		if (this.left_muscle.length + leftMuscleShift <= 50 && this.left_muscle.length + leftMuscleShift >= 25)
			this.left_muscle.length += leftMuscleShift;
		if (this.right_muscle.length + rightMuscleShift <= 50 && this.right_muscle.length + rightMuscleShift >= 25)
			this.right_muscle.length += rightMuscleShift;
		if (this.bodyLeftLegMuscle.length + bodyLeftLegShift <= 60 && this.bodyLeftLegMuscle.length + bodyLeftLegShift >= 30)
			this.bodyLeftLegMuscle.length += bodyLeftLegShift;
		if (this.bodyRightLegMuscle.length + bodyRightLegShift <= 60 && this.bodyRightLegMuscle.length + bodyRightLegShift >= 30)
			this.bodyRightLegMuscle.length += bodyRightLegShift;

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
		let leggy = new Leggy(this.getParams());
		leggy.brain = this.brain.clone();
		return leggy;
	}
}