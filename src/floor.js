const createFloor = () => {
  const floorDef = new b2.BodyDef();
  floorDef.type = b2.Body.b2_staticBody;
  floorDef.position.Set(4, 4);

  const floorFixDef = new b2.FixtureDef();
  floorFixDef.density = 1;
  floorFixDef.restitution = 0.1;
  floorFixDef.friction = 0.5;
  floorFixDef.shape = new b2.PolygonShape();
  floorFixDef.shape.SetAsBox(4, 0.1);

  const floor = globals.world.CreateBody(floorDef)
  floor.CreateFixture(floorFixDef);
  return floor;
}