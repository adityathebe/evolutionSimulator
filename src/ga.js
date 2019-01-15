
class GeneticAlgorithm {

  static initializePopulation() {
    globals.generationIndex = 1;
    for (let i = 0; i < config.populationSize; i += 1) {
      const human = new Human(2, 2.5);
      globals.humans.push(human);
    }
  }

  static simulateSingleStep() {
    globals.world.Step(1 / 60, 8, 3);
    globals.world.ClearForces();
    for (const human of globals.humans) {
      human.walk(config.motorNoise);
      human.simulateStep();
    }
    globals.stepCounter += 1;
  };

  static assignFitness() {
    const totalScore = globals.humans.reduce((acc, cur) => ({ score: acc.score + cur.score })).score;
    for (const human of globals.humans) {
      human.fitness = human.score / totalScore;
    }
  }

  static createNextGeneration() {

    // Evaluate Fitness
    GeneticAlgorithm.assignFitness();

    // Create New Set of humans
    const newGeneration = [];
    for (let i = 0; i < config.populationSize; i++) {
      const parentA = GeneticAlgorithm.selectOne();
      const parentB = GeneticAlgorithm.selectOne();

      // Crossover
      const child = GeneticAlgorithm.crossover(parentA, parentB);

      // Mutation
      GeneticAlgorithm.mutate(child);
      newGeneration.push(child);
    }

    // Kill current generation
    GeneticAlgorithm.killGeneration();

    // Add new set of humans to next generation
    globals.humans = newGeneration;
    globals.generationIndex += 1;
  }

  static killGeneration() {
    for (const human of globals.humans) {
      for (const bodyPart of human.bodyParts) {
        globals.world.DestroyBody(bodyPart);
      }
    }
  }

  static selectOne() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r -= globals.humans[index].fitness;
      index += 1;
    }

    index -= 1;
    return globals.humans[index];
  }

  static mutate(human) {
    for (const gene of human.genome) {
      const randomNum = Math.random();
      if (randomNum < config.mutationRate) {
        gene.timeFactor *= Math.random();
        gene.cosFactor *= Math.random();
        gene.timeShift *= Math.random();
      }
    }
  }

  static crossover(parentA, parentB) {
    const totalJoints = parentA.genome.length;
    const dividingIndex = Math.floor(Math.random() * totalJoints);
    const newGenome = [];
    for (let i = 0; i < totalJoints; i += 1) {
      const parent = i < dividingIndex ? parentA : parentB;
      const newGene = {
        cosFactor: parent.genome[i].cosFactor,
        timeShift: parent.genome[i].timeShift,
        timeFactor: parent.genome[i].timeFactor,
      }
      newGenome.push(newGene);
    }
    
    const child = new Human(2, 2.5, newGenome);
    return child;
  }
}
