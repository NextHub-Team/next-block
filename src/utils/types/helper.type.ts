export function createEnum<T extends string>(keys: T[]): { [K in T]: K } {
	return keys.reduce((acc, key) => {
		acc[key] = key;
		return acc;
	}, Object.create(null));
}
