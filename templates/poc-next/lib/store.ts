export type RecordItem = { id: string; label: string };

const items: RecordItem[] = [{ id: "demo-1", label: "Fake sample" }];

export function listItems(): RecordItem[] {
  return [...items];
}

export function getItem(id: string): RecordItem | undefined {
  return items.find((item) => item.id === id);
}
