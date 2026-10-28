export function removeEmptyListItem(items: string[], index: number, key: string, composing: boolean) {
  if (composing || (key !== "Backspace" && key !== "Delete") || index < 0 || index >= items.length || items[index].trim()) return null;
  return { items: items.filter((_, itemIndex) => itemIndex !== index), focusIndex: Math.max(0, index - 1) };
}
