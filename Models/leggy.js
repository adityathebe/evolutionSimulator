let staticVar = false;

class Leggy {

	constructor(params = {}) {
		this.id = params.id || 0;
		this.upperLength = params.upperLength || 40;
		this.upperWidth = params.upperWidth || 15;
		this.lowerLength = params.lowerLength || 30;
		this.lowerWidth = params.lowerWidth || 10;
		this.backboneWidth = params.backboneWidth || 30;
		this.backboneLength = params.backboneLength || 60;
		this.footLength = 10;
		this.footWidth = 20;
		this.handWidth = 40;
		this.handLength = 10;
		this.score = 0;
		this.fitness = 0;
		this.x = width * 0.10;
		this.y = height * 0.75;
		this.brain = new NeuralNetwork(20, 50, 6);
		this.legBodyMuscleRestLength = Math.sqrt((this.backboneWidth * this.backboneWidth) + (this.upperLength * this.upperLength))

		this.leftHand = Matter.Bodies.rectangle(160, 455, this.handWidth, this.handLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.1,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.rightHand = Matter.Bodies.rectangle(160, 455, this.handWidth, this.handLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.1,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.leftFoot = Matter.Bodies.rectangle(153, 545, this.footWidth, this.footLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.1,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.rightFoot = Matter.Bodies.rectangle(100, 535, this.footWidth, this.footLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.1,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.upperRightLeg = Matter.Bodies.rectangle(130, 500, this.upperWidth, this.upperLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			isStatic: staticVar,
		});

		this.lowerRightLeg = Matter.Bodies.rectangle(105, 525, this.lowerWidth, this.lowerLength, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 1,
			slop: 0,
			density: 0.05,
			restitution: 0.01,
			isStatic: staticVar,
		});

		this.upperLeftLeg = Matter.Bodies.rectangle(148, 500, this.upperWidth, this.upperLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			isStatic: staticVar,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		this.lowerLeftLeg = Matter.Bodies.rectangle(150, 530, this.lowerWidth, this.lowerLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.05,
			isStatic: staticVar,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			},
		});

		this.backbone = Matter.Bodies.rectangle(this.x, this.y, this.backboneWidth, this.backboneLength, {
			friction: 1,
			slop: 0,
			restitution: 0.01,
			density: 0.05,
			// isStatic: true,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			},
		});

		this.connectBones();
		this.connectMuscles();
	}

	connectBones() {

		this.leftHandJoint = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.leftHand,
			pointA: { x: this.backboneWidth / 2, y: 0 },
			pointB: { x: -this.handWidth / 2, y: 0 },
			length: 0,
			stiffness: 1,
		});

		this.rightHandJoint = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.rightHand,
			pointA: { x: this.backboneWidth / 2, y: 0 },
			pointB: { x: -this.handWidth / 2, y: 0 },
			length: 0,
			stiffness: 1,
		});

		this.leftFootJoint = Matter.Constraint.create({
			bodyA: this.leftFoot,
			bodyB: this.lowerLeftLeg,
			pointA: { x: -this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: this.lowerLength / 2 },
			length: 0,
			stiffness: 1,
		});

		this.rightFootJoint = Matter.Constraint.create({
			bodyA: this.rightFoot,
			bodyB: this.lowerRightLeg,
			pointA: { x: -this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: this.lowerLength / 2 },
			length: 0,
			stiffness: 1,
		});

		this.leftLegJoint = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.lowerLeftLeg,
			pointA: { x: 0, y: this.upperLength / 2 },
			pointB: { x: 0, y: -this.lowerLength / 2 },
			length: 0,
			stiffness: 1,
		});

		this.rightLegJoint = Matter.Constraint.create({
			bodyA: this.upperRightLeg,
			bodyB: this.lowerRightLeg,
			pointA: { x: 0, y: this.upperLength / 2 },
			pointB: { x: 0, y: -this.lowerLength / 2 },
			length: 0,
			stiffness: 1,
		});

		this.leftMainJoint = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperLeftLeg,
			pointA: { x: this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: -this.upperLength / 2 },
			length: 0,
			stiffness: 1,
		});

		this.rightMainJoint = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperRightLeg,
			pointA: { x: this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: -this.upperLength / 2 },
			length: 0,
			stiffness: 1,
		});
	}

	connectMuscles() {

		this.leftHandMuscle = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.leftHand,
			length: 25,
			pointA: { x: this.backboneWidth / 2, y: -this.backboneLength / 2 },
			pointB: { x: 0, y: 0 },
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.rightHandMuscle = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.rightHand,
			length: 25,
			pointA: { x: this.backboneWidth / 2, y: -this.backboneLength / 2 },
			pointB: { x: 0, y: 0 },
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.leftFootMuscle = Matter.Constraint.create({
			bodyA: this.leftFoot,
			bodyB: this.lowerLeftLeg,
			length: 20,
			pointA: { x: this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: 0 },
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.rightFootMuscle = Matter.Constraint.create({
			bodyA: this.rightFoot,
			bodyB: this.lowerRightLeg,
			length: 20,
			pointA: { x: this.footWidth / 2, y: 0 },
			pointB: { x: 0, y: 0 },
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.bodyLeftLegMuscle = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperLeftLeg,
			length: this.legBodyMuscleRestLength + 10,
			pointA: { x: -this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: this.upperLength / 2 },
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.bodyRightLegMuscle = Matter.Constraint.create({
			bodyA: this.backbone,
			bodyB: this.upperRightLeg,
			length: this.legBodyMuscleRestLength - 10,
			pointA: { x: -this.backboneWidth / 2, y: this.backboneLength / 2 },
			pointB: { x: 0, y: this.upperLength / 2 },
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.leftMuscle = Matter.Constraint.create({
			bodyA: this.upperLeftLeg,
			bodyB: this.lowerLeftLeg,
			pointB: { x: 0, y: this.lowerLength / 2 },
			length: 45,
			stiffness: 1,
			damping: 0,
			render: { visible: false },
		});

		this.rightMuscle = Matter.Constraint.create({
			bodyA: this.upperRightLeg,
			bodyB: this.lowerRightLeg,
			pointB: { x: 0, y: this.lowerLength / 2 },
			length: 45,
			stiffness: 1,
			damping: 0,
			render: { visible: false },
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
		Matter.World.add(world, [this.leftHand, this.rightHand]);

		// Bones Joints
		Matter.World.add(world, [this.rightMainJoint, this.leftMainJoint]);
		Matter.World.add(world, [this.leftLegJoint, this.rightLegJoint]);
		Matter.World.add(world, [this.leftFootJoint, this.rightFootJoint]);
		Matter.World.add(world, [this.leftHandJoint, this.rightHandJoint]);

		// Muscles
		Matter.World.add(world, [this.leftMuscle, this.rightMuscle]);
		Matter.World.add(world, [this.bodyLeftLegMuscle, this.bodyRightLegMuscle]);
		Matter.World.add(world, [this.leftFootMuscle, this.rightFootMuscle]);
		Matter.World.add(world, [this.leftHandMuscle, this.rightHandMuscle]);
	}

	/**
	 * Removes all parts of the person from MatterJS world
	 * @param {Matter.World} world 
	 */
	removeFromWorld(world) {
		// Body Compmonents
		Matter.World.remove(world, [this.upperRightLeg, this.upperLeftLeg, this.lowerLeftLeg, this.lowerRightLeg]);
		Matter.World.remove(world, [this.backbone, this.leftFoot, this.rightFoot]);
		Matter.World.remove(world, [this.leftHand, this.rightHand]);

		// Bones Joints
		Matter.World.remove(world, [this.rightMainJoint, this.leftMainJoint]);
		Matter.World.remove(world, [this.leftLegJoint, this.rightLegJoint]);
		Matter.World.remove(world, [this.leftFootJoint, this.rightFootJoint]);
		Matter.World.remove(world, [this.leftHandJoint, this.rightHandJoint]);

		// Muscles
		Matter.World.remove(world, [this.leftMuscle, this.rightMuscle]);
		Matter.World.remove(world, [this.bodyLeftLegMuscle, this.bodyRightLegMuscle]);
		Matter.World.remove(world, [this.leftFootMuscle, this.rightFootMuscle]);
		Matter.World.remove(world, [this.leftHandMuscle, this.rightHandMuscle]);

		// Dispose its brain
		this.brain.dispose();
	}

	/**
   * Returns an object of with all the parameters required to create a new Bipedal
   * @returns {Object}
   */
	getParams() {
		return Object.assign({}, {
			upperLength: this.upperLength,
			upperWidth: this.upperWidth,
			lowerLength: this.lowerLength,
			lowerWidth: this.lowerWidth,
			backboneLength: this.backboneLength,
			backboneWidth: this.backboneWidth,
			x: this.x,
			y: this.y,
			id: this.id,
		});
	}

	adjustScore() {
		const walkingScore = this.backbone.position.x - this.x;
		const isBackboneBalanced = Math.abs(this.backbone.angle) <= 0.40;
		const isLowerLeftLegBalanced = this.lowerLeftLeg.angle >= 0.4 && this.lowerLeftLeg.angle <= 1;
		const isLowerRightLegBalanced = this.lowerRightLeg.angle >= 0.4 && this.lowerRightLeg.angle <= 1;
		const isUpperLeftLegBalanced = Math.abs(this.lowerLeftLeg.angle) <= 0.45;
		const isUpperRightLegBalanced = Math.abs(this.lowerRightLeg.angle) <= 0.45;
		this.score += walkingScore
			* (isLowerLeftLegBalanced && isUpperLeftLegBalanced ? 1 : 0.1)
			// * (isUpperLeftLegBalanced ? 2 : 0.50)
			* (isLowerRightLegBalanced && isUpperRightLegBalanced ? 1 : 0.1)
			// * (isUpperRightLegBalanced ? 2 : 0.50)
			* (isBackboneBalanced ? 2 : 0.05)
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
			vxLowerLeftLeg,
			vxUpperLeftLeg,
			vxLowerRighttLeg,
			vxUpperRightLeg,
			vxBackbone,
			vyLowerLeftLeg,
			vyUpperLeftLeg,
			vyLowerRightLeg,
			vyUpperRightLeg,
			vyBackbone,
		]);

		// Move Muscles
		const leftMuscleShift = result[0] > 0.5 ? 2 : -2;
		const rightMuscleShift = result[1] > 0.5 ? 2 : -2;
		const bodyLeftLegShift = result[2] > 0.5 ? 2 : -2;
		const bodyRightLegShift = result[3] > 0.5 ? 2 : -2;
		const leftHandShift = result[4] > 0.5 ? 2 : -2;
		const rightHandShift = result[5] > 0.5 ? 2 : -2;

		if (this.leftMuscle.length + leftMuscleShift <= 45 && this.leftMuscle.length + leftMuscleShift >= 25)
			this.leftMuscle.length += leftMuscleShift;
		if (this.rightMuscle.length + rightMuscleShift <= 45 && this.rightMuscle.length + rightMuscleShift >= 25)
			this.rightMuscle.length += rightMuscleShift;
		if (this.bodyLeftLegMuscle.length + bodyLeftLegShift <= 60 && this.bodyLeftLegMuscle.length + bodyLeftLegShift >= 30)
			this.bodyLeftLegMuscle.length += bodyLeftLegShift;
		if (this.bodyRightLegMuscle.length + bodyRightLegShift <= 60 && this.bodyRightLegMuscle.length + bodyRightLegShift >= 30)
			this.bodyRightLegMuscle.length += bodyRightLegShift;
		if (this.leftHandMuscle.length + leftHandShift <= 30 && this.leftHandMuscle.length + leftHandShift >= 15)
			this.leftHandMuscle.length += leftHandShift;
		if (this.rightHandMuscle.length + rightHandShift <= 30 && this.rightHandMuscle.length + rightHandShift >= 15)
			this.rightHandMuscle.length += rightHandShift;
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