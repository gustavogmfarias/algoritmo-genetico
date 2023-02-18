import { GeneticAlgorithm } from "./models/GeneticAlgorithm.js";

const genetic = new GeneticAlgorithm(6);

genetic.addProducts();

genetic.initializePopulation();

genetic.printPopulation();
genetic.crossOver();
