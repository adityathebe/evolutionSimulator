class Generation {

  /**
   * Takes in a population value
   * @constructor
   * @param {number} population - The population Size
   */

  constructor(population) {
    this.population = population;
    this.species = [];
    this.generation = 1;
    this.high_score = 0;
    this.avg_score = 0;
    this.total_score = 0;
    this.fitness = 0;
    this.progress = 0;
  }

  /**
   * Initalize the Generation with creatures
   * @param {object}
   */
  initialize(Creature, option) {
    for (let i = 0; i < this.population; i++) {
      let newCreature = new Creature(option);
      newCreature.id = i;
      this.species.push(newCreature);
    }
  }

  /**
   * Picks one creature from the population
   * based on fitness
   * @returns A creature
   */
  pickOne() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r -= this.species[index].fitness;
      index += 1;
    }

    index -= 1;

    let selected = this.species[index].clone();
    return selected;
  }

  evolve() {

    // Store High Score
    this.generation += 1;
    let gen_highscore = Math.max.apply(Math, this.species.map(o => o.score));
    this.high_score = gen_highscore > this.high_score ? gen_highscore : this.high_score;

    // Calculate Total Score of this Generation
    let total_score = 0;
    this.species.forEach((creature) => { total_score += creature.score });

    // Assign Fitness to each creature
    this.progress = (total_score / this.population) - this.avg_score
    this.avg_score = total_score / this.population;
    for (let i = 0; i < this.population; i++) {
      this.species[i].fitness = this.species[i].score / total_score;
    };

    // Breeding
    let new_generation = [];
    for (let i = 0; i < this.population; i++) {
      let parentA = this.pickOne();
      let parentB = this.pickOne();
      let child = parentA.crossover(parentB);
      child.mutate();
      child.id = i;
      new_generation.push(child);

      console.log(`[${parentA.id}(${this.species[parentA.id].fitness.toFixed(2)}), ${parentB.id}(${this.species[parentB.id].fitness.toFixed(2)})] => ${i}`)
    }

    // Kill Current Generation.
    // i.e. Remove their bodies from MatterJS World and dispose their brain
    for (let i = 0; i < this.population; i++) {
      this.species[i].removeFromWorld(world);
      this.species[i].brain.dispose();
      delete this.species[i];
    }

    // Add new children to the current generation
    this.species = new_generation;
    for (let i = 0; i < this.population; i++) {
      this.species[i].addToWorld(world);
    }
  }

  /**
   * Returns the creature with the current highest score
   * @returns {Creature}
   */
  getBest() {
    let max = 0;
    let max_index = 0;
    this.species.forEach((creature, index) => {
      if (max < creature.score) {
        max = creature.score;
        max_index = index;
      }
    });
    return generation.species[max_index];
  }
}