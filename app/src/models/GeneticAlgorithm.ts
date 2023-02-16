import Product from "./Product.js";

interface Individual {
  chromosome: number[];
  fitness: number;
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
      const individual: Individual = { chromosome: [], fitness: 0 };

      for (let j = 0; j < this.products.length; j++) {
        individual.chromosome.push(Math.round(Math.random()));
      }

      this.population.push(individual);
    }
  }

  public printPopulation(): void {
    console.table(this.population);
  }
}
