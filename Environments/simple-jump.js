const BOUNDARY_COLLISION_GROUP = 0X0001;

class SimpleJump {

	/**
	 * @constructor
	 */
	constructor() {
		this.ground = Matter.Bodies.rectangle(width / 2, height - 15, width, 50, {
			isStatic: true,
			friction: 1,
			collisionFilter: {
				category: BOUNDARY_COLLISION_GROUP
			}
		});

		this.roof = Matter.Bodies.rectangle(width / 2, 10, width, 20, {
			isStatic: true,
			friction: 1,
			collisionFilter: {
				category: BOUNDARY_COLLISION_GROUP
			}
		});

		this.left_wall = Matter.Bodies.rectangle(10, height / 2, 20, height, {
			isStatic: true,
			friction: 1,
			collisionFilter: {
				category: BOUNDARY_COLLISION_GROUP
			}
		});

		this.right_wall = Matter.Bodies.rectangle(width - 10, height / 2, 20, height, {
			isStatic: true,
			friction: 1,
			collisionFilter: {
				category: BOUNDARY_COLLISION_GROUP
			}
		});

		this.obstacle = Matter.Bodies.circle(width / 2, height - 70, 15, {
			friction: 1,
			collisionFilter: {
				category: BOUNDARY_COLLISION_GROUP
			}
		});

		this.gun = Matter.Bodies.rectangle(width - 10, height -70, 100, 30, {
			friction: 1,
			collisionFilter: {
				category: BOUNDARY_COLLISION_GROUP
			}
		});
	}

	/**
	 * Adds the current boundary to MatterJS World
	 */
	addToWorld() {
		Matter.World.add(world, [this.ground, this.roof, this.left_wall, this.right_wall]);
		Matter.World.add(world, [this.gun, this.obstacle]);
	}

	move(direction) {
		Matter.Body.setVelocity(this.obstacle, { x: -20, y: 0 });
	}

	display() {
		fill(color(118, 240, 155))
		rect(this.ground.position.x, this.ground.position.y, width, 50);
		rect(this.left_wall.position.x, this.left_wall.position.y, 20, height);
		rect(this.right_wall.position.x, this.right_wall.position.y, 20, height);
		rect(this.roof.position.x, this.roof.position.y, width, 20);
		rect(this.obstacle.position.x, this.obstacle.position.y, width, 20);
	}
}