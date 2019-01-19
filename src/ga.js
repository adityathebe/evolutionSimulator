class GeneticAlgorithm {

  static useCustomGenome(customGenome) {
    globals.humans.forEach((human) => {
      human.genome = JSON.parse(JSON.stringify(customGenome));
    });
  }

  static initializePopulation() {
    globals.generationIndex = 1;
    globals.aliveHumans = 0;
    UIController.displayGenerationIndex();
    UIController.displayBestHumanStats();
    for (let i = 0; i < config.populationSize; i += 1) {
      globals.aliveHumans += 1;
      const human = new Human(config.initialPosition.x, config.initialPosition.y);
      globals.humans.push(human);
    }
  }

  static simulateSingleStep() {
    globals.world.Step(1 / 60, 8, 3);
    globals.world.ClearForces();

    if (globals.aliveHumans === 0) {
      clearInterval(globals.simulationInterval);
      clearInterval(globals.evolutionInterval);
      GeneticAlgorithm.createNextGeneration();
      GeneticAlgorithm.runAllSimulationIntervals();
    }

    for (const human of globals.humans) {
      if (human.isAlive && human.torso.GetPosition().y >= 3.5) {
        human.isAlive = false;
        globals.aliveHumans -= 1;
      }

      if (human.isAlive) {
        human.walk(config.motorNoise);
        human.assignScore();
      }
    }
    globals.stepCounter += 1;
  };

  static runAllSimulationIntervals() {
    // Evolve every <config.simulationPeriod> seconds
    globals.evolutionInterval = setInterval(() => {
      GeneticAlgorithm.createNextGeneration();
    }, 1000 * config.simulationPeriod / config.simulationSpeed);

    // Run Simulation
    globals.simulationInterval = setInterval(() => {
      for (let i = 0; i < config.simulationSpeed; i += 1) {
        GeneticAlgorithm.simulateSingleStep();
      }
    }, 1000 / 60);
  }

  static assignFitness(totalScore) {
    for (const human of globals.humans) {
      human.fitness = human.score / totalScore;
    }
  }

  static createNextGeneration() {

    // Store Generation High score
    const totalScore = globals.humans.reduce((acc, cur) => ({ score: acc.score + cur.score })).score;
    const genBestHuman = globals.humans.reduce((a, b) => a.score > b.score ? a : b);
    const genHighScore = genBestHuman.score;
    const genAvgScore = totalScore / config.populationSize;
    globals.generationHighScores.push(genHighScore);
    globals.generationAvgScores.push(genAvgScore);
    UIController.displayChart();

    // Store Best Human
    if (genHighScore > globals.bestHuman.score) {
      globals.bestHuman = genBestHuman;
    }

    // Evaluate Fitness
    GeneticAlgorithm.assignFitness(totalScore);

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
    globals.stepCounter = 0;
    globals.aliveHumans = newGeneration.length;
    UIController.displayGenerationIndex();
    UIController.displayBestHumanStats();
  }

  static killGeneration() {
    for (const human of globals.humans) {
      if (human.isAlive) {
        globals.isAlive -= 1;
        human.isAlive = false;
      }

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

    const child = new Human(config.initialPosition.x, config.initialPosition.y, newGenome);
    return child;
  }
}
