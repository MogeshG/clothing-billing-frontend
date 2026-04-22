type AnyData =
  | string
  | number
  | boolean
  | null
  | undefined
  | AnyData[]
  | { [key: string]: AnyData };

const toSnakeKey = (key: string) =>
  key.replace(/([A-Z])/g, "_$1").toLowerCase();

const toCamelKey = (key: string) =>
  key.replace(/(_[a-z])/g, (match) => match[1].toUpperCase());

export const camelToSnake = <T extends AnyData>(data: T): T => {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => camelToSnake(item)) as T;
  }

  if (typeof data === "object") {
    const result: Record<string, AnyData> = {};

    for (const [key, value] of Object.entries(data)) {
      result[toSnakeKey(key)] = camelToSnake(value as AnyData);
    }

    return result as T;
  }

  return data;
};

export const snakeToCamel = <T extends AnyData>(data: T): T => {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => snakeToCamel(item)) as T;
  }

  if (typeof data === "object") {
    const result: Record<string, AnyData> = {};

    for (const [key, value] of Object.entries(data)) {
      result[toCamelKey(key)] = snakeToCamel(value as AnyData);
    }

    return result as T;
  }

  return data;
};
