export class Money {
  constructor(private readonly amount: number) {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
  }

  get value(): number {
    return this.amount;
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    return new Money(this.amount - other.amount);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  divide(divisor: number): Money {
    if (divisor === 0) throw new Error('Cannot divide by zero');
    return new Money(this.amount / divisor);
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    return this.amount < other.amount;
  }

  format(locale = 'id-ID', currency = 'IDR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.amount);
  }

  static zero(): Money {
    return new Money(0);
  }
}
