// Simple sequential ID generators. Kept centralized so the format can
// change in one place later (e.g. adding a year prefix).

export function nextMemberId(members) {
  const numbers = members
    .map((m) => parseInt(m.id.replace('TW', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `TW${String(next).padStart(3, '0')}`;
}

export function nextEntityId(prefix, list) {
  const numbers = list
    .map((item) => parseInt(String(item.id).replace(prefix, ''), 10))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
}
