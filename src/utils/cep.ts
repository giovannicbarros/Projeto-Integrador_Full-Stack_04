const CEP_LENGTH = 8;

export function unformatCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, CEP_LENGTH);
}

export function formatCep(value: string): string {
  return unformatCep(value).replace(/^(\d{5})(\d)/, '$1-$2');
}
