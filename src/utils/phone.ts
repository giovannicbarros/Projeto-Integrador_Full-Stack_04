const PHONE_MAX_LENGTH = 11;

export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH);
}

export function formatPhone(value: string): string {
  const digits = unformatPhone(value);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}
