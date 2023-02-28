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
  private readonly products: Product[] = [];

  constructor(
    private readonly populationSize: number,
    private readonly mutationRate: number,
    private readonly reproductionRate: number
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
    const populationCopy = [...this.population];

    const parents: Parents[] = [];

    for (let i = 0; i < (this.population.length / 2) * this.mutationRate; i++) {
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

    console.log(parents);
  }

  public printPopulation(): void {
    console.table(this.population);
  }
}
