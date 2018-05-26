class Generation {
    constructor(population) {
        this.population = population;
        this.species = [];
        this.generation = 1;
        this.high_score = 0;
        this.total_score = 0;
        this.fitness = 0;
    }

    initialize(Creature) {
        for (let i = 0; i < this.population; i++) {
            let new_creature = new Creature({upper_length: 50, 
                upper_width: 10, 
                lower_length: 50,
                lower_width: 6,
                x: width * 0.10, 
                y: height * 0.85 });
            this.species.push(new_creature);
        }
    }

    pick_one(range) {
        let index = 0;
        let r = random(range);
        while (r > 0) {
            r -= this.species[index].score;
            index += 1;
        }

        index -= 1;
        return this.species[index].clone();
    }

    evolve() {
        this.generation += 1;
        let gen_highscore = Math.max.apply(Math, this.species.map(o => o.score));
        this.high_score = gen_highscore > this.high_score ? gen_highscore : this.high_score;

        // Calculate Total Score of this Generation
        let total_score = 0;
        this.species.forEach((creature) => { total_score += creature.score });
        this.fitness = total_score / this.population;

        // Store New Childs Temporarily in this array
        let new_generation = [];

        for (let i = 0; i < this.population; i++) {
            let parentA = this.pick_one(total_score);
            let parentB = this.pick_one(total_score);
            let child = parentA.crossover(parentB);
            child.mutate();
            new_generation.push(child);

            parentA.brain.input_weights.dispose();
            parentB.brain.input_weights.dispose(); 
            parentA.brain.output_weights.dispose();
            parentB.brain.output_weights.dispose();
        }

        // Kill Current Generation and add new children to the current generation
        this.species.forEach((creature) => { creature.kill(world) })
        this.species = new_generation;
        this.species.forEach((creature) => { creature.add_to_world(world) });
    }
}