// In-memory storage (replace with database in production)
const stringStore = new Map();

export function createString(id, value, properties) {
  const stringRecord = {
    id,
    value,
    properties,
    created_at: new Date().toISOString()
  };
  stringStore.set(id, stringRecord);
  return stringRecord;
}

export function findStringByValue(value) {
  return Array.from(stringStore.values()).find(item => item.value === value);
}

export function findStringById(id) {
  return stringStore.get(id);
}

export function getAllStrings() {
  return Array.from(stringStore.values());
}

export function deleteString(id) {
  return stringStore.delete(id);
}

export function getStringCount() {
  return stringStore.size;
}

export function findStringEntryByValue(value) {
  return Array.from(stringStore.entries()).find(([_, item]) => item.value === value);
}