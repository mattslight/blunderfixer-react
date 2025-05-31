export function formatTimeControl(tc: string): string {
  const [base, inc] = tc.split('+');
  const minutes = Number(base) / 60;
  const baseStr = Number.isInteger(minutes) ? `${minutes}` : minutes.toFixed(1);
  return inc ? `${baseStr}m+${inc}` : `${baseStr}min`;
}
