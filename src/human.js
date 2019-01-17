const bodyDef = {
  head: { height: 0.15, width: 0.20 },
  neck: { height: 0.12, width: 0.1 },
  torso: { height: 0.6, width: 0.2 },
  upperArm: { height: 0.3, width: 0.08 },
  lowerArm: { height: 0.25, width: 0.06 },
  upperLeg: { height: 0.4, width: 0.18 },
  lowerLeg: { height: 0.35, width: 0.12 },
  foot: { height: 0.1, width: 0.26 },
}

class Human {
  constructor(x, y, genome) {
    this.x = x;
    this.y = y;
    this.density = 500;
    this.genomes = [];
    this.joints = [];
    this.maxDistance = x;
    this.stepsMade = 0;
    this.score = 0;
    this.isAlive = true;
    this.fitness = 0;
    this.bodyDelta = 0;
    this.legDelta = 0;

    // General Body Defintion
    this.bodyDef = new b2.BodyDef();
    this.bodyDef.type = b2.Body.b2_staticBody;
    this.bodyDef.type = b2.Body.b2_dynamicBody;
    this.bodyDef.linearDamping = 0;
    this.bodyDef.angularDamping = 0.01;
    this.bodyDef.allowSleep = true;
    this.bodyDef.awake = true;

    // General Fixture Definition
    this.fixtureDef = new b2.FixtureDef();
    this.fixtureDef.density = this.density;
    this.fixtureDef.restitution = 0.1;
    this.fixtureDef.friction = 0.8;
    this.fixtureDef.shape = new b2.PolygonShape();
    this.fixtureDef.filter.groupIndex = -1;

    // Create body parts and joints
    this.bodyParts = this.createBodyParts();
    this.joints = this.createBodyJoints();

    // Create genome based on number of joints
    if (genome) {
      this.genome = JSON.parse(JSON.stringify(genome))
    } else {
      this.genome = this.createGenomes();
    }
  }
  
  //////////////////////////////////
  // Simulation Related Functions //
  //////////////////////////////////

  assignScore() {
    const currentMaxDistance = this.maxDistance;
    const currentDistance = this.torso.GetWorldCenter().x;
    const newMaxDistance = Math.max(currentMaxDistance, currentDistance);

    const headHeightDelta = this.head.GetPosition().y;
    const footHeightDelta = Math.max(this.leftFoot.GetPosition().y, this.rightFoot.GetPosition().y);
    this.bodyDelta = Math.abs(footHeightDelta - headHeightDelta);
    this.legDelta = this.rightFoot.GetPosition().x - this.leftFoot.GetPosition().x;

    if (this.bodyDelta > config.minBodyDelta) {
      if (newMaxDistance > currentMaxDistance) {
        this.score += this.bodyDelta / config.minBodyDelta;
        this.maxDistance = newMaxDistance;
        if (Math.abs(this.legDelta) > config.minLegDelta) {
          if (!this.legDeltaSign) {
            this.legDeltaSign = this.legDelta / Math.abs(this.legDelta);
          } else if (this.legDeltaSign * this.legDelta < 0) {
            this.legDeltaSign = this.legDelta / Math.abs(this.legDelta);
            this.stepsMade += 1;
            this.score += this.maxDistance + (this.stepsMade * 2000);
          }
        }
      } else {
        this.score -= (this.bodyDelta / config.minBodyDelta) * 0.05;
      }
    }
  }

  walk(motorNoise) {
    for (let i = 0; i < this.genome.length; i += 1) {
      const amp = (1 + motorNoise * (Math.random() * 2 - 1)) * this.genome[i].cosFactor;
      const freq = (1 + motorNoise * (Math.random() * 2 - 1)) * this.genome[i].timeFactor;
      const phase = (1 + motorNoise * (Math.random() * 2 - 1)) * this.genome[i].timeShift;
      this.joints[i].SetMotorSpeed(amp * Math.cos(phase + freq * globals.stepCounter));
    }
  }

  createGenomes() {
    const genome = []
    this.joints.forEach(() => {
      genome.push({
        cosFactor: 6 * Math.random() - 3,
        timeFactor: Math.random() / 10,
        timeShift: Math.random() * Math.PI / 2,
      });
    });
    return genome;
  }

  ////////////
  // Bodies //
  ////////////

  createBodyParts() {
    this.head = this.createHead();
    this.neck = this.createNeck();
    this.torso = this.createTorso();
    this.upperLeftLeg = this.createUpperLeg();
    this.upperRightLeg = this.createUpperLeg();
    this.lowerLeftLeg = this.createLowerLeg();
    this.lowerRightLeg = this.createLowerLeg();
    this.leftFoot = this.createFoot();
    this.rightFoot = this.createFoot();
    this.upperLeftArm = this.createUpperArm();
    this.upperRightArm = this.createUpperArm();
    this.lowerLeftArm = this.createLowerArm();
    this.lowerRightArm = this.createLowerArm();

    return [
      this.head, this.neck, this.torso,
      this.upperLeftArm, this.upperRightArm,
      this.lowerLeftArm, this.lowerRightArm,
      this.upperLeftLeg, this.upperRightLeg,
      this.lowerLeftLeg, this.lowerRightLeg,
      this.leftFoot, this.rightFoot,
    ];
  }

  createHead() {
    this.bodyDef.position.Set(this.x, this.y - (bodyDef.torso.height / 2) - (bodyDef.neck.height));
    const head = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.head.width / 2, bodyDef.head.height / 2);
    head.CreateFixture(this.fixtureDef);
    return head;
  }

  createNeck() {
    this.bodyDef.position.Set(this.x, this.y - (bodyDef.torso.height / 2) - (bodyDef.neck.height / 2));
    const neck = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.neck.width / 2, bodyDef.neck.height / 2);
    neck.CreateFixture(this.fixtureDef);
    return neck;
  }

  createTorso() {
    this.bodyDef.position.Set(this.x, this.y);
    const torso = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.torso.width / 2, bodyDef.torso.height / 2);
    torso.CreateFixture(this.fixtureDef);
    return torso;
  }

  createUpperArm() {
    this.bodyDef.position.Set(this.x, this.y - (bodyDef.upperArm.height / 2));
    const upperArm = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.upperArm.width / 2, bodyDef.upperArm.height / 2);
    upperArm.CreateFixture(this.fixtureDef);
    return upperArm;
  }

  createLowerArm() {
    this.bodyDef.position.Set(this.x, this.y + (bodyDef.lowerArm.height / 2));
    const lowerArm = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.lowerArm.width / 2, bodyDef.lowerArm.height / 2);
    lowerArm.CreateFixture(this.fixtureDef);
    return lowerArm;
  }

  createUpperLeg() {
    this.bodyDef.position.Set(this.x, this.y + (bodyDef.torso.height / 2) + (bodyDef.upperLeg.height / 2));
    const upperLeg = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.upperLeg.width / 2, bodyDef.upperLeg.height / 2);
    upperLeg.CreateFixture(this.fixtureDef);
    return upperLeg;
  }

  createLowerLeg() {
    this.bodyDef.position.Set(this.x, this.y + (bodyDef.torso.height / 2) + (bodyDef.upperLeg.height) + (bodyDef.lowerLeg.height / 2));
    const upperLeg = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.lowerLeg.width / 2, bodyDef.lowerLeg.height / 2);
    upperLeg.CreateFixture(this.fixtureDef);
    return upperLeg;
  }

  createFoot() {
    this.bodyDef.position.Set(this.x + 0.06,
      this.y + (bodyDef.torso.height / 2) + (bodyDef.upperLeg.height) + (bodyDef.lowerLeg.height) + (bodyDef.foot.height / 2));
    const upperLeg = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.foot.width / 2, bodyDef.foot.height / 2);
    upperLeg.CreateFixture(this.fixtureDef);
    return upperLeg;
  }


  ////////////
  // Joints //
  ////////////

  createBodyJoints() {
    this.leftLegTorsoJoint = this.createLegTorsoJoint(this.upperLeftLeg);
    this.rightLegTorsoJoint = this.createLegTorsoJoint(this.upperRightLeg);
    this.leftLegJoint = this.createLegJoint(this.upperLeftLeg, this.lowerLeftLeg);
    this.rightLegJoint = this.createLegJoint(this.upperRightLeg, this.lowerRightLeg);
    this.leftFootJoint = this.createLegFootJoint(this.lowerLeftLeg, this.leftFoot);
    this.rightFootJoint = this.createLegFootJoint(this.lowerRightLeg, this.rightFoot);
    this.rightArmTorsoJoint = this.createArmTorsoJoint(this.upperRightArm);
    this.leftArmTorsoJoint = this.createArmTorsoJoint(this.upperLeftArm);
    this.leftArmJoint = this.createArmJoint(this.upperLeftArm, this.lowerLeftArm);
    this.rightArmJoint = this.createArmJoint(this.upperRightArm, this.lowerRightArm);
    this.neckTorsoJoint = this.createNeckTorsoJoint();
    this.neckHeadJoint = this.createNeckHeadJoint();

    return [
      this.neckHeadJoint,
      this.leftArmTorsoJoint, this.rightArmTorsoJoint,
      this.leftLegTorsoJoint, this.rightLegTorsoJoint,
      this.leftLegJoint, this.rightLegJoint,
      this.leftFootJoint, this.rightFootJoint,
      this.leftArmJoint, this.rightArmJoint,
    ];
  }

  createNeckHeadJoint() {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = this.head.GetWorldCenter().Clone();
    jointDef.Initialize(this.head, this.neck, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 10;
    jointDef.upperAngle = Math.PI / 10;
    return globals.world.CreateJoint(jointDef);
  }

  createNeckTorsoJoint() {
    const jointDef = new b2.WeldJointDef();
    jointDef.bodyA = this.neck;
    jointDef.bodyB = this.torso;
    jointDef.localAnchorA = new b2.Vec2(0, bodyDef.neck.height / 2);
    jointDef.localAnchorB = new b2.Vec2(0, -bodyDef.torso.height / 2);
    jointDef.referenceAngle = 0;    
    return globals.world.CreateJoint(jointDef);
  }

  createArmJoint(upperArm, lowerArm) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = this.torso.GetWorldCenter().Clone();
    jointDef.Initialize(upperArm, lowerArm, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 2;
    jointDef.upperAngle = 0;
    return globals.world.CreateJoint(jointDef);
  }

  createArmTorsoJoint(arm) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = arm.GetWorldCenter().Clone();
    anchorPoint.y -= bodyDef.upperArm.height / 2;
    jointDef.Initialize(this.torso, arm, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 4;
    jointDef.upperAngle = Math.PI / 8;
    return globals.world.CreateJoint(jointDef);
  }

  createLegTorsoJoint(leg) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = this.torso.GetWorldCenter().Clone();
    anchorPoint.y += bodyDef.torso.height / 2;
    jointDef.Initialize(this.torso, leg, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 6;
    jointDef.upperAngle = Math.PI / 6;
    return globals.world.CreateJoint(jointDef);
  }

  createLegJoint(upperLeg, lowerLeg) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = upperLeg.GetWorldCenter().Clone();
    anchorPoint.y += bodyDef.lowerLeg.height / 2;
    jointDef.Initialize(upperLeg, lowerLeg, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = 0.2;
    jointDef.upperAngle = 1.2;
    return globals.world.CreateJoint(jointDef);
  }

  createLegFootJoint(lowerLeg, foot) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = lowerLeg.GetWorldCenter().Clone();
    anchorPoint.y += (bodyDef.foot.height / 2) + (bodyDef.lowerLeg.height / 2);
    jointDef.Initialize(lowerLeg, foot, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 8;
    jointDef.upperAngle = Math.PI / 8;
    return globals.world.CreateJoint(jointDef);
  }

  display() {

    fill('#FA2F2E');
    drawRect(this.leftFoot);
    drawRect(this.upperLeftLeg);
    drawRect(this.lowerLeftLeg);
    drawRect(this.upperLeftArm);
    drawRect(this.lowerLeftArm);

    fill('blue')
    drawRect(this.neck);
    drawRect(this.torso);
    drawRect(this.head);

    fill('yellow');
    drawRect(this.lowerRightLeg);
    drawRect(this.upperRightLeg);
    drawRect(this.rightFoot);
    drawRect(this.upperRightArm);
    drawRect(this.lowerRightArm);
  }

}