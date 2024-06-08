export const isServer = () => typeof window === "undefined";
export const isClient = () => typeof window !== "undefined";

export const objectPick = <T extends object, K extends keyof T>(
  obj: T,
  keys: Array<K>
) => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Record<keyof T, T[K]>);
};
