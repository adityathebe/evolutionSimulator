/* Simple Neural Network library that can only create neural networks of exactly 3 layers */

class NeuralNetwork {
    constructor(input_nodes, hidden_nodes, output_nodes) {

        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;

        // Initialize random weights
        this.input_weights = tf.randomNormal([this.input_nodes, this.hidden_nodes]);
        this.output_weights = tf.randomNormal([this.hidden_nodes, this.output_nodes]);
    }

    predict(user_input) {
        /* Takes a 1D array */
        let input_layer = tf.tensor(user_input, [1, this.input_nodes]);
        let hidden_layer = input_layer.matMul(this.input_weights);
        let output_layer = hidden_layer.matMul(this.output_weights);
        return output_layer;
    }
}