import { GeneticAlgorithm } from "./models/GeneticAlgorithm.js";

const genetic = new GeneticAlgorithm(6, 0.03, 1, 3000, 5);

genetic.addProducts();

genetic.initializePopulation();

genetic.crossOver();
genetic.printPopulation();
genetic.result();
