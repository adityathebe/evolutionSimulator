class Bipedal {
  constructor(params) {
    this.id = params.id;
    this.leftLegLength = params.leftLegLength;
    this.leftLegWidth = params.leftLegWidth;
    this.rightLegLength = params.rightLegLength;;
    this.rightLegWidth = params.rightLegWidth;
    this.bodyLength = params.bodyLength;
    this.bodyWidth = params.bodyWidth;
    this.params = params;
    this.score = 0;
    this.fitness = 0;
    this.parents = [];
    this.brain = new NeuralNetwork(10, 25, 2);

    ////////////////
    // Body parts //
    ////////////////
    this.leftLeg = Matter.Bodies.rectangle(params.posX - 75, params.posY + 40, params.leftLegLength, params.leftLegWidth, {
      friction: 0.8,
      restitution: 0.1,
      density: 0.05,
      collisionFilter: {
        category: 0x0006,
        mask: 0x0001,
      },
      // isStatic: true,
    });

    this.rightLeg = Matter.Bodies.rectangle(params.posX + 80, params.posY + 40, params.rightLegLength, params.rightLegWidth, {
      friction: 0.8,
      restitution: 0.1,
      density: 0.05,
      collisionFilter: {
        category: 0x0004,
        mask: 0x0001,
      },
      // isStatic: true,
    });

    this.body = Matter.Bodies.rectangle(params.posX, params.posY, params.bodyLength, params.bodyWidth, {
      friction: 0.8,
      restitution: 0.1,
      density: 0.05,
      collisionFilter: {
        category: 0x0002,
        mask: 0x0001,
      },
      // isStatic: true,
    });

    this.makeJoints();
  }

  makeJoints() {

    ////////////
    // Joints //
    ////////////
    this.leftJoint = Matter.Constraint.create({
      bodyA: this.leftLeg,
      bodyB: this.body,
      pointA: { x: (this.leftLegLength / 2) * 0.80, y: 0 },
      pointB: { x: (-this.bodyLength / 2) * 0.80, y: 0 },
      length: 0,
      stiffness: 1,
    });

    this.rightJoint = Matter.Constraint.create({
      bodyA: this.rightLeg,
      bodyB: this.body,
      pointA: { x: (-this.rightLegLength / 2) * 0.80, y: 0 },
      pointB: { x: (this.bodyLength / 2) * 0.80, y: 0 },
      length: 0,
      stiffness: 1,
    });

    ///////////////////
    // Muscle Joints //
    ///////////////////
    this.leftMuscle = Matter.Constraint.create({
      bodyA: this.leftLeg,
      bodyB: this.body,
      length: 0.8 * ((this.rightLegLength / 2) + (this.bodyLength / 2)),
      pointA: { x: (-this.rightLegLength / 2) * 0.80, y: 0 },
      stiffness: 1,
    });

    this.rightMuscle = Matter.Constraint.create({
      bodyA: this.rightLeg,
      bodyB: this.body,
      length: 0.8 * ((this.rightLegLength / 2) + (this.bodyLength / 2)),
      pointA: { x: (this.rightLegLength / 2) * 0.80, y: 0 },
      stiffness: 1
    });
  }

	/**
	 * Adds all parts of the person in MatterJS world
	 * @param {Matter.World} world 
	 */
  addToWorld(world) {
    Matter.World.add(world, [this.leftLeg, this.rightLeg, this.body]);
    Matter.World.add(world, [this.leftJoint]);
    Matter.World.add(world, [this.leftMuscle]);
    Matter.World.add(world, [this.rightJoint]);
    Matter.World.add(world, [this.rightMuscle]);
  }

	/**
	 * Removes all parts of the person from MatterJS world
	 * @param {Matter.World} world 
	 */
  removeFromWorld(world) {
    Matter.World.remove(world, [this.leftLeg, this.rightLeg, this.body]);
    Matter.World.remove(world, [this.leftJoint]);
    Matter.World.remove(world, [this.leftMuscle]);
    Matter.World.remove(world, [this.rightJoint]);
    Matter.World.remove(world, [this.rightMuscle]);

    // Dispose its brain
    this.brain.dispose();
  }

  clone() {
    let params = Object.assign({}, this.params);
    let bipedal = new Bipedal(params);
    bipedal.brain.dispose();
    bipedal.brain = this.brain.clone();
    return bipedal;
  }


  adjustScore() {
    // Blancing score (Head should be level)
    const isHeadBalanced = Math.abs(this.body.angle) < 0.2;
    const walkingScore = this.body.position.x - this.params.posX;
    const velocity = this.body.velocity.x;
    this.score += walkingScore * (isHeadBalanced ? 2 : 0.1) * velocity;
  }

  think(boundary) {

    // Prepare inputs
    const ground = boundary.ground;
    const bodyHeightAboveGround = (ground.position.y - this.body.position.y) / width;
    const leftLegHeightAboveGround = (ground.position.y - this.leftLeg.position.y) / width;
    const rightLegHeightAboveGround = (ground.position.y - this.rightLeg.position.y) / width;
    const vx = this.body.velocity.x;
    const vy = this.body.velocity.y;
    const leftMuscleLength = this.leftMuscle.length / 70;
    const rightMuscleLength = this.rightMuscle.length / 70;
    const bodyAngle = this.body.angle;
    const leftLegAngle = this.leftLeg.angle;
    const rightLegAngle = this.rightLeg.angle;

    const input = [
      bodyHeightAboveGround,
      leftLegHeightAboveGround,
      rightLegHeightAboveGround,
      vx,
      vy,
      leftMuscleLength,
      rightMuscleLength,
      bodyAngle,
      leftLegAngle,
      rightLegAngle
    ];

    // Predict
    const result = this.brain.predict(input);

    // Move Muscles
    let leftMuscleShift = result[0] > 0.5 ? 3 : -3;
    let rightMuscleShift = result[1] > 0.5 ? 3 : -3;

    if (this.leftMuscle.length < 70 && this.leftMuscle.length > 25)
      this.leftMuscle.length += leftMuscleShift;
    if (this.rightMuscle.length < 70 && this.rightMuscle.length > 25)
      this.rightMuscle.length += rightMuscleShift;

    // Adjust Score
    this.adjustScore();
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
}