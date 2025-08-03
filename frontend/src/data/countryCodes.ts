type CountryCodeType = {
  value: `+${number}`
  label: string
  default?: boolean
}

export const countryCodes: CountryCodeType[] = [
  { value: '+55', label: '🇧🇷 +55 (Brasil)', default: true },
  { value: '+1', label: '🇺🇸 +1 (EUA)' },
  { value: '+52', label: '🇲🇽 +52 (México)' },
  { value: '+54', label: '🇦🇷 +54 (Argentina)' },
  { value: '+351', label: '🇵🇹 +351 (Portugal)' },
  { value: '+34', label: '🇪🇸 +34 (Espanha)' },
  { value: '+33', label: '🇫🇷 +33 (França)' },
  { value: '+49', label: '🇩🇪 +49 (Alemanha)' },
  { value: '+39', label: '🇮🇹 +39 (Itália)' },
  { value: '+44', label: '🇬🇧 +44 (Reino Unido)' },
  { value: '+86', label: '🇨🇳 +86 (China)' },
  { value: '+81', label: '🇯🇵 +81 (Japão)' },
  { value: '+61', label: '🇦🇺 +61 (Austrália)' },
  { value: '+91', label: '🇮🇳 +91 (Índia)' },
];