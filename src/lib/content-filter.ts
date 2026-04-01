// Blocked words/patterns for inappropriate content filtering
const blockedPatterns: RegExp[] = [
  // Profanity and slurs (Portuguese)
  /\b(porra|caralho|merda|fod[aeiou]|put[ao]|viado|arrombad[ao]|cuzão|buceta|cacete|desgraça|vagabund[ao]|filh[ao]\s*da\s*put[ao])\b/gi,
  // Hate speech patterns
  /\b(matar|assassinar|bomb[ao]|explod|terror)\b/gi,
  // Threats
  /\b(vou\s+te\s+matar|ameaç|vou\s+acabar)\b/gi,
];

export function containsInappropriateContent(text: string): boolean {
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return blockedPatterns.some((pattern) => pattern.test(normalized) || pattern.test(text));
}

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  
  // Check for known invalid patterns
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}
