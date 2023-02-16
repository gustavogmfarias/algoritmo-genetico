export default class Product {
  private _profitPerWeight: number;

  constructor(
    public readonly id: number,
    public readonly weight: number,
    public readonly profit: number
  ) {
    this._profitPerWeight = Number((profit / weight).toFixed(2));
  }

  get profitPerWeight(): number {
    return this._profitPerWeight;
  }
}
