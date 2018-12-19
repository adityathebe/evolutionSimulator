class SimpleBoundary {

  /**
   * @constructor
   */
  constructor() {
    this.ground = Matter.Bodies.rectangle(width / 2, height - 15, width, 50, {
      isStatic: true,
      friction: 1,
      restitution: 0.1,
      collisionFilter: {
        category: 0x0001
      }
    });

    this.roof = Matter.Bodies.rectangle(width / 2, 10, width, 20, {
      isStatic: true,
      friction: 1,
      collisionFilter: {
        category: 0x0001
      }
    });

    this.left_wall = Matter.Bodies.rectangle(10, height / 2, 20, height, {
      isStatic: true,
      friction: 1,
      collisionFilter: {
        category: 0x0001
      }
    });

    this.right_wall = Matter.Bodies.rectangle(width - 10, height / 2, 20, height, {
      isStatic: true,
      friction: 1,
      collisionFilter: {
        category: 0x0001
      }
    });
  }

  /**
   * Adds the current boundary to MatterJS World
   */
  addToWorld(world) {
    Matter.World.add(world, [this.ground, this.roof, this.left_wall, this.right_wall]);
  }
}