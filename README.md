# [DEMO](https://adityathebe.github.io/evolutionSimulator/)
    
# Evolution Simulator

- [x] Neural Network
- [x] Genetic Algorithm
- [x] Physics Environment

# Project Structure

- Environments : Various Environment Models
- Creatures : Various Creature Models
- NeuroEvolution : Neural Network and Genetic Algorithm library
- Lib : p5.js, Matter.js and Tensorflow.js

# System Design

### 1. Neural Network

All creatures have a 3 layer feed-forward Neural Network as their brain. The topology is **4 - 100 - X**, where the number of nodes X in the output layer depend on the number of muscles of the creature. The input data fed to the network are:

- Horizontal velocity
- Vertical Velocity
- Torque
- Height above the ground level

### 2. Genetic Algorithm Design

![](https://visualstudiomagazine.com/articles/2014/03/01/~/media/ECG/visualstudiomagazine/Images/2014/03/EvolutionaryAlgorithm.ashx)

#### a. Score:

A creature can gain points based on the distance it travels from the starting point. The further it travels in the correct direction, the more point it gains. Traveling in the opposite direction, will reduce the point.

#### b. Fitness Function:

The further the creatures go to the right the more they are rewarded.

#### c. Selection Algorithm:

The creatures are selected for breeding based on their fitness value. The fitness value acts like a probability of being chosen for reproduction. Creatures that perform better have higher fitness value and hence has higher chance of reproducing.

#### d. **Crossover:**

*The objective of this function is to generate a new child by combining the genes of two parents*.

Two creatures (*parents*) are selected using the selection algorithm. Their weights are interchanged randomly bit wise as shown in the picture below to form a new set of weights. In our case, a single bit represents a single weight. This new set of weights is used to form a new creature (*child).*

![](https://static.thinkingandcomputing.com/2014/03/crossover.png)

#### e. Mutation:

*The objective of this function is to introduce randomness in the population by tweaking the weights in the Neural network (brain) of a creature.*

This function accepts a mutation rate as its parameter. The mutation rate, which is usually about 1 - 2%, is in fact the probability of introduction of randomness.