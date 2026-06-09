/** Strips whitespace and empty entries from a draft string list before saving. */
export function cleanList(list: string[]): string[] {
  return list.map((item) => item.trim()).filter(Boolean);
}
