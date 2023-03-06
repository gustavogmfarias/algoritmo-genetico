import Product from "./Product.js";

interface Individual {
  id: number;
  chromosome: number[];
  weight: number;
  profit: number;
  fitness: number;
  generation: number;
  probability?: number;
}
interface Parents {
  parent1: Individual;
  parent2: Individual;
}
export class GeneticAlgorithm {
  private population: Individual[] = [];
  private currentGeneration: number = 1;
  private readonly products: Product[] = [];

  constructor(
    private readonly populationSize: number,
    private readonly mutationRate: number,
    private readonly reproductionRate: number,
    private readonly packWeight: number,
    private readonly numberOfGenerations: number
  ) {}

  public addProducts(): void {
    const productA = new Product(1, 400, 200);
    const productB = new Product(2, 500, 200);
    const productC = new Product(3, 700, 300);
    const productD = new Product(4, 900, 400);
    const productE = new Product(5, 600, 400);
    const productF = new Product(6, 700, 200);
    this.products.push(
      productA,
      productB,
      productC,
      productD,
      productE,
      productF
    );
  }

  public initializePopulation(): void {
    for (let i = 0; i < this.populationSize; i++) {
      const individual: Individual = {
        id: i,
        chromosome: [],
        fitness: 0,
        profit: 0,
        weight: 0,
        generation: 1,
      };

      for (let j = 0; j < this.products.length; j++) {
        individual.chromosome.push(Math.round(Math.random()));
      }
      this.fitnessFunction(individual);

      this.population.push(individual);
    }

    this.probabilityGenerator();
  }

  public fitnessFunction(individual: Individual) {
    let weight = 0;
    let profit = 0;
    individual.chromosome.map((individual, index) => {
      if (individual === 1) {
        profit += this.products[index].profit;
        weight += this.products[index].weight;
      }
    });
    individual.weight = weight;
    individual.profit = profit;
    individual.fitness = profit;
  }

  public probabilityGenerator(): void {
    for (const individual of this.population) {
      const everyFitness = this.population.reduce((acc, individual) => {
        return (acc += individual.fitness);
      }, 0);

      individual.probability = Number(
        (individual.fitness / everyFitness).toFixed(6)
      );
    }

    this.population.sort((a, b) => {
      if ((a.probability as number) > (b.probability as number)) {
        return -1;
      }
      if ((a.probability as number) < (b.probability as number)) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
  }

  public roleta(population: Individual[]): number[] {
    const arrRoleta = new Array<number>(100);
    let indexAnterior = null;

    for (let i = 0; i < population.length; i++) {
      for (const individual of population) {
        const everyFitness = population.reduce((acc, individual) => {
          return (acc += individual.fitness);
        }, 0);

        individual.probability = Number(
          (individual.fitness / everyFitness).toFixed(5)
        );
      }

      for (const chromosome of population) {
        const chromosomeProb = Math.round(
          (chromosome.probability as number) * 100
        );

        const chromosomeIndex = this.population.indexOf(chromosome);

        if (!indexAnterior) {
          const start = 0;
          const end = chromosomeProb;
          indexAnterior = end - 1;
          arrRoleta.fill(chromosome.id, start, end);
        } else {
          const start: number = indexAnterior;

          const end = start + chromosomeProb;
          indexAnterior = end;
          arrRoleta.fill(chromosome.id, start, end);
        }
      }
    }

    return arrRoleta;
  }

  public crossOver() {
    for (let i = 0; i < this.numberOfGenerations - 1; i++) {
      this.currentGeneration++;
      const parents = this.parentsGenerator();

      this.reproduction(parents);
    }
  }

  public parentsGenerator(): Parents[] {
    const populationCopy = [...this.population];

    const parents: Parents[] = [];

    for (
      let i = 0;
      i < (this.population.length / 2) * this.reproductionRate;
      i++
    ) {
      let arrRoleta = this.roleta(populationCopy);
      //parents
      //Escolhendo primeiro pai

      const firstParentChosen = Math.floor(Math.random() * 100);
      const firstParentChosenId = arrRoleta[firstParentChosen];
      const firstParentValue = this.population.find((chromosome) => {
        return chromosome.id === firstParentChosenId;
      });
      const firstParentValueIndex = populationCopy.findIndex((chromosome) => {
        return chromosome.id === firstParentChosenId;
      });

      populationCopy.splice(firstParentValueIndex, 1);

      //Escolhendo segundo pai
      arrRoleta = this.roleta(populationCopy);

      const secondParentChosen = Math.floor(Math.random() * 100);
      const secondParentChosenId = arrRoleta[secondParentChosen];
      const secondParentValue = this.population.find((chromosome) => {
        return chromosome.id === secondParentChosenId;
      });
      const secondParentValueIndex = populationCopy.findIndex((chromosome) => {
        return chromosome.id === secondParentChosenId;
      });

      populationCopy.splice(secondParentValueIndex, 1);

      let parent = {
        parent1: firstParentValue as Individual,
        parent2: secondParentValue as Individual,
      };

      parents.push(parent);
    }

    if (parents.length < 3) {
      throw new Error("menos de 3 pais");
    }

    return parents;
  }

  public reproduction(parents: Parents[]) {
    const startAlter = this.getRandomIntInclusive(0, this.products.length - 1);

    parents.map((parents, index) => {
      const willMutation = this.mutationRate > Math.random();

      let firstParent = parents.parent1;
      const firstParentChromosomeCopy = firstParent.chromosome.slice(
        startAlter,
        firstParent.chromosome.length
      );

      let secondParent = parents.parent2;

      const secondParentChromosomeCopy = secondParent.chromosome.slice(
        startAlter,
        firstParent.chromosome.length
      );

      //firstChild
      let firstChild: Individual = {
        id: this.getRandomIntInclusive(1, 10000),
        chromosome: [],
        fitness: 0,
        weight: 0,
        profit: 0,
        generation: this.currentGeneration,
      };

      firstChild.chromosome = [...secondParent.chromosome];

      firstChild.chromosome.splice(
        startAlter,
        this.products.length - startAlter,
        ...firstParentChromosomeCopy
      );

      //secondChild

      let secondChild: Individual = {
        id: this.getRandomIntInclusive(1, 10000),
        chromosome: [],
        fitness: 0,
        weight: 0,
        profit: 0,
        generation: this.currentGeneration,
      };

      secondChild.chromosome = [...firstParent.chromosome];

      secondChild.chromosome.splice(
        startAlter,
        this.products.length - startAlter,
        ...secondParentChromosomeCopy
      );

      // mutation

      if (willMutation) {
        const indexMutation = this.getRandomIntInclusive(
          0,
          this.products.length - 1
        );
        const newValueFirstChild =
          firstChild.chromosome[indexMutation] === 0 ? 1 : 0;

        firstChild.chromosome.splice(indexMutation, 1, newValueFirstChild);

        const newValueSecondChild =
          secondChild.chromosome[indexMutation] === 0 ? 1 : 0;

        secondChild.chromosome.splice(indexMutation, 1, newValueSecondChild);
      }

      this.fitnessFunction(firstChild);
      this.population.push(firstChild);
      this.fitnessFunction(secondChild);
      this.population.push(secondChild);
      this.probabilityGenerator();
    });

    this.fixPopulation();
    this.probabilityGenerator();
  }

  public fixPopulation(): void {
    for (const individual of this.population) {
      if (this.population.length > this.populationSize) {
        if (individual.weight > this.packWeight) {
          let individualValue = this.population.find(
            (individualValue) => individualValue.id === individual.id
          );

          let individualIndex = this.population.indexOf(
            individualValue as Individual
          );

          this.population.splice(individualIndex, 1);
        }
      }
    }

    if (this.population.length > this.populationSize) {
      this.population.splice(this.populationSize, this.populationSize * 10);
    }
  }

  public getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public printPopulation(): void {
    console.table(this.population);
  }

  public result(): void {
    const individual = this.population.find(
      (individual) => individual.weight <= this.packWeight
    );

    if (individual) {
      console.log(individual);
    } else {
      console.log(
        "Não foi encontrado um indivíduo cujo o peso seja menor que o peso da mochila de:",
        this.packWeight
      );
    }
  }
}
