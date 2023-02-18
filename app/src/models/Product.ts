export default class Product {
  private _profitPerWeight: number;

  constructor(
    public readonly id: number,
    public readonly weight: number,
    public readonly profit: number
  ) {
  }


}
