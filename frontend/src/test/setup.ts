import '@testing-library/jest-dom/vitest';

// Simple localStorage mock for jsdom environment
class MemoryStorage {
	private store: Record<string, string> = {};
	getItem(key: string) {
		return this.store[key] ?? null;
	}
	setItem(key: string, value: string) {
		this.store[key] = value;
	}
	removeItem(key: string) {
		delete this.store[key];
	}
	clear() {
		this.store = {};
	}
}

if (!globalThis.localStorage) {
	// @ts-expect-error: jsdom global
	globalThis.localStorage = new MemoryStorage();
}
