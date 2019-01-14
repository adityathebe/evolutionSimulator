const bodyDef = {
  trunk: { height: 0.6, width: 0.2 },
  upperLeg: { height: 0.4, width: 0.18 },
  lowerLeg: { height: 0.35, width: 0.12 },
  foot: { height: 0.1, width: 0.26 },
  upperArm: { height: 0.3, width: 0.08 },
  lowerArm: { height: 0.25, width: 0.06 },
}

class Human {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.density = 500;
    this.genomes = [];
    this.joints = [];
    this.bodies = [];

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

    this.createBodyParts();
    this.createBodyJoints();
    this.createGenomes();
  }

  walk(motor_noise = 0.05) {
    for (let i = 0; i < this.genomes.length; i += 1) {
      // const output = this.genomes[i].predict([
      //   this.joints[i].GetJointAngle(),
      //   this.joints[i].GetMotorSpeed(),
      // ]);

      const cosFactor = 6 * Math.random() - 3;
      const timeShift = Math.random() / 10;
      const timeFactor = Math.random() * Math.PI / 2;

      const amp = (1 + motor_noise * (Math.random() * 2 - 1)) * cosFactor;
      const phase = (1 + motor_noise * (Math.random() * 2 - 1)) * timeShift;
      const freq = (1 + motor_noise * (Math.random() * 2 - 1)) * timeFactor;
      this.joints[i].SetMotorSpeed(amp * Math.cos(phase + freq));
    }
  }

  createBodyParts() {
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
  }

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

    this.joints.push(this.leftArmTorsoJoint);
    this.joints.push(this.rightArmTorsoJoint);
    this.joints.push(this.leftLegTorsoJoint);
    this.joints.push(this.rightLegTorsoJoint);
    this.joints.push(this.leftLegJoint);
    this.joints.push(this.rightLegJoint);
    this.joints.push(this.leftFootJoint);
    this.joints.push(this.rightFootJoint);
    this.joints.push(this.leftArmJoint);
    this.joints.push(this.rightArmJoint);
  }

  createGenomes() {
    for (const joint of this.joints) {
      const nn = new NeuralNetwork(2, 10, 3);
      this.genomes.push(nn);
    }
  }

  ////////////
  // Bodies //
  ////////////
  createTorso() {
    this.bodyDef.position.Set(this.x, this.y);
    const torso = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.trunk.width / 2, bodyDef.trunk.height / 2);
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
    this.bodyDef.position.Set(this.x, this.y + (bodyDef.trunk.height / 2) + (bodyDef.upperLeg.height / 2));
    const upperLeg = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.upperLeg.width / 2, bodyDef.upperLeg.height / 2);
    upperLeg.CreateFixture(this.fixtureDef);
    return upperLeg;
  }

  createLowerLeg() {
    this.bodyDef.position.Set(this.x, this.y + (bodyDef.trunk.height / 2) + (bodyDef.upperLeg.height) + (bodyDef.lowerLeg.height / 2));
    const upperLeg = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.lowerLeg.width / 2, bodyDef.lowerLeg.height / 2);
    upperLeg.CreateFixture(this.fixtureDef);
    return upperLeg;
  }

  createFoot() {
    this.bodyDef.position.Set(this.x + 0.06,
      this.y + (bodyDef.trunk.height / 2) + (bodyDef.upperLeg.height) + (bodyDef.lowerLeg.height) + (bodyDef.foot.height / 2));
    const upperLeg = globals.world.CreateBody(this.bodyDef);
    this.fixtureDef.shape.SetAsBox(bodyDef.foot.width / 2, bodyDef.foot.height / 2);
    upperLeg.CreateFixture(this.fixtureDef);
    return upperLeg;
  }


  ////////////
  // Joints //
  ////////////

  createArmJoint(upperArm, lowerArm) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = this.torso.GetWorldCenter().Clone();
    jointDef.Initialize(upperArm, lowerArm, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;

    // == Limit Angles == //
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 1.5;
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

    // == Limit Angles == //
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 4;
    jointDef.upperAngle = Math.PI / 8;
    return globals.world.CreateJoint(jointDef);
  }

  createLegTorsoJoint(leg) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = this.torso.GetWorldCenter().Clone();
    anchorPoint.y += bodyDef.trunk.height / 2;
    jointDef.Initialize(this.torso, leg, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;

    // == Limit Angles == //
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 18;
    jointDef.upperAngle = Math.PI / 10;
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

    // == Limit Angles == //
    jointDef.enableLimit = true;
    jointDef.lowerAngle = 0.2;
    jointDef.upperAngle = 1.2;
    return globals.world.CreateJoint(jointDef);
  }

  createLegFootJoint(lowerLeg, foot) {
    const jointDef = new b2.RevoluteJointDef();
    const anchorPoint = lowerLeg.GetWorldCenter().Clone();
    anchorPoint.y += bodyDef.foot.height / 2;
    jointDef.Initialize(lowerLeg, foot, anchorPoint);
    jointDef.maxMotorTorque = config.maxTorque;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    // jointDef.localAnchorB(foot.GetWorldCenter().x, foot.GetWorldCenter().y)

    // == Limit Angles == //
    jointDef.enableLimit = true;
    jointDef.lowerAngle = -Math.PI / 4;
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
    drawRect(this.torso);

    fill('yellow');
    drawRect(this.lowerRightLeg);
    drawRect(this.upperRightLeg);
    drawRect(this.rightFoot);
    drawRect(this.upperRightArm);
    drawRect(this.lowerRightArm);
  }

}