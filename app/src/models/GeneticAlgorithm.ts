import Product from "./Product.js";

interface Individual {
  id: number;
  chromosome: number[];
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
  private populationSize: number;
  private readonly products: Product[] = [];

  constructor(private readonly maxGenerations: number) {}

  public addProducts(): void {
    const productA = new Product(1, 400, 200);
    const productB = new Product(2, 500, 200);
    const productC = new Product(3, 700, 300);
    const productD = new Product(4, 900, 400);
    const productE = new Product(5, 600, 400);
    this.products.push(productA, productB, productC, productD, productE);
    this.populationSize = this.products.length;
  }

  public initializePopulation(): void {
    for (let i = 0; i < this.populationSize; i++) {
      const individual: Individual = {
        id: i,
        chromosome: [],
        fitness: 0,
        generation: 1,
      };

      for (let j = 0; j < this.products.length; j++) {
        individual.chromosome.push(Math.round(Math.random()));
      }

      let valueFitness = 0;
      individual.chromosome.map((individual, index) => {
        if (individual === 1) {
          valueFitness += this.products[index].profit;
        }
      });

      individual.fitness = valueFitness;

      this.population.push(individual);
    }

    for (const individual of this.population) {
      const everyFitness = this.population.reduce((acc, individual) => {
        return (acc += individual.fitness);
      }, 0);

      individual.probability = Number(
        (individual.fitness / everyFitness).toFixed(5)
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

  public roleta(
    population: Individual[],
    giros?: number,
    txReproducao?: number
  ): number[] {
    const arrRoleta = new Array<number>(100);
    let indexAnterior = null;

    //Gerar roleta
    for (let i = 0; i < population.length; i++) {
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
    const populationCopy = [...this.population];
    const parents: Parents[] = [];

    const arrRoleta = this.roleta(populationCopy);

    const secondParentChosen = Math.floor(Math.random() * 100);
    const secondParentChosenId = arrRoleta[secondParentChosen];
    const secondParentValue = this.population.find((chromosome) => {
      return chromosome.id === secondParentChosenId;
    });
    const secondParentValueIndex = this.population.findIndex((chromosome) => {
      return chromosome.id === secondParentChosenId;
    });
    populationCopy.splice(secondParentValueIndex, 1);

    let parent = {
      parent1: firstParentValue as Individual,
      parent2: secondParentValue as Individual,
    };

    parents.push(parent);
  }

  public printPopulation(): void {
    console.table(this.population);
  }
}
