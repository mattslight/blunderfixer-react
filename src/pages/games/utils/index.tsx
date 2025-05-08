export function formatTimeControl(tc: string) {
  const parts = tc.split('+').map((n) => parseInt(n, 10));
  const init = parts[0] || 0;
  const inc = parts[1] || 0;
  const m = Math.floor(init / 60);
  const s = init % 60;
  let str = m ? `${m}m` : '';
  if (s) str += ` ${s}s`;
  if (inc) str += ` +${inc}s`;
  return str.trim();
}
