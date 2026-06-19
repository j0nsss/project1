export class Percentage {
  constructor(private readonly value: number) {
    if (!Number.isFinite(value)) {
      throw new Error('Percentage must be a finite number');
    }
    if (value < 0 || value > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
  }

  get asDecimal(): number {
    return this.value / 100;
  }

  get asPercent(): number {
    return this.value;
  }

  applyTo(amount: number): number {
    return amount * this.asDecimal;
  }

  format(locale = 'id-ID'): string {
    return `${this.value.toLocaleString(locale)}%`;
  }

  static fromDecimal(decimal: number): Percentage {
    return new Percentage(decimal * 100);
  }
}
