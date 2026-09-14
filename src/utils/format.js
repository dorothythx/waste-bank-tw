export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `${value.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} บาท`;
}

export function formatNumber(amount, unit = '') {
  const value = Number(amount) || 0;
  const formatted = value.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function todayIso() {
  return new Date().toISOString();
}

// Phone number formatting -----------------------------------------------
// Standard stored/display format: XXX-XXX-XXXX (10 digits, Thai mobile).
//
// formatPhoneInput: used on every keystroke/paste in a phone <input>. It
// strips anything that isn't a digit (so pasted "081-234-5678" or
// "081 234 5678" both collapse to the same digits first), caps the result
// at 10 digits, then re-inserts the dashes as the user types.
export function formatPhoneInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

// isValidPhoneDigits: true only when there are exactly 10 digits, ignoring
// any dashes/spaces already present in the value.
export function isValidPhoneDigits(value) {
  return String(value ?? '').replace(/\D/g, '').length === 10;
}

// normalizePhoneNumber: returns the canonical "XXX-XXX-XXXX" string for
// storage, or null when the value doesn't contain exactly 10 digits.
export function normalizePhoneNumber(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length !== 10) return null;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
