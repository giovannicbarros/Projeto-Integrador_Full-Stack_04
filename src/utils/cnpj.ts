const CNPJ_LENGTH = 14;

const FIRST_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_DIGIT_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export function unformatCnpj(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCnpj(value: string): string {
  const digits = unformatCnpj(value).slice(0, CNPJ_LENGTH);

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function calculateCheckDigit(digits: string, weights: number[]): number {
  const sum = weights.reduce((total, weight, index) => total + weight * Number(digits[index]), 0);
  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const digits = unformatCnpj(value);

  if (digits.length !== CNPJ_LENGTH) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(digits)) {
    return false;
  }

  const firstCheckDigit = calculateCheckDigit(digits, FIRST_DIGIT_WEIGHTS);
  const secondCheckDigit = calculateCheckDigit(digits, SECOND_DIGIT_WEIGHTS);

  return digits === `${digits.slice(0, 12)}${firstCheckDigit}${secondCheckDigit}`;
}
