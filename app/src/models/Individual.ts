import Product from "./Product.js";

export class Individual {
  constructor(
    public readonly chromossome: number[],
    public readonly fitness: number
  ) {}
}
