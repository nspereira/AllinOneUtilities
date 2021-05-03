import { compress, decompress } from 'lz-string';
import { v4 as uuid } from 'uuid';
import { filter, find, get, set, unset } from 'lodash';

export class StorageManager<V> {
	private compressionStrategy = compress;
	private decompressionStrategy = decompress;
	private _vault: V = {} as any;

	constructor(private engine: Storage, private storeKey: string) {
		this.read();
	}

	public fetch(): V {
		return this._vault ?? ({} as any);
	}
	public find<T>(path: string): T {
		return get(this._vault, path);
	}

	public prop<T>(basePath: string, defaultValue?: T) {
		const propValue: any = this.find<T>(basePath);
		return {
			collection: {
				insert: (item: Partial<T>, required = {} as any) => {
					requireField(required);
					this.set<T[]>(basePath, [
						...(propValue ?? []),
						{
							id: uuid(),
							...item,
						},
					] as T[]);
				},
				remove: (id: string) => {
					requireField({ id });
					this.set<T[]>(basePath, [
						...(propValue ?? []).filter((t: any) => t.id !== id),
					] as T[]);
				},
				findOne: (predicate: any) => find(propValue, predicate),
				find: (predicate: any) => filter(propValue, predicate),
			},
			get: (defaultValue?: any) => propValue ?? defaultValue,
			set: (value: T) => this.set<T>(basePath, value),
			remove: () => this.remove<T>(basePath),
		};
	}

	private set<T>(path: string, value: T) {
		this.write(set<V>({ ...this.read() } as any, path, value));
	}
	private remove<T>(path: string) {
		const store = { ...this.fetch() };
		if (unset(store, path)) {
			this.write(store);
		}
	}

	private read(): V {
		try {
			const decompressed = this.decompress(
				this.engine.getItem(this.storeKey) ?? ''
			);
			if (this.isFreshData(decompressed)) {
				this._vault = decompressed;
			}
		} catch (error) {
			// do nothing
		}
		return this.fetch();
	}
	private write(data: any) {
		if (!this.isFreshData(data)) {
			return;
		}
		this._vault = data;
		this.engine.setItem(
			this.storeKey,
			this.toSafeString(this.compress(data))
		);
	}

	private hash(data: any = this._vault) {
		const str = this.toSafeString(data);
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const character = str.charCodeAt(i);
			hash = (hash << 5) - hash + character;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}
	private compress(data: any) {
		return this.compressionStrategy(this.toSafeString(data));
	}
	private decompress(compressed: any) {
		const decompressed = this.decompressionStrategy(compressed);
		if (decompressed !== null) {
			return JSON.parse(decompressed);
		}
	}

	private isFreshData(data: any) {
		return !this._vault || this.hash() !== this.hash(data);
	}
	private toSafeString(data: any) {
		if (typeof data === 'string' || typeof data === 'number') {
			return data.toString().trim();
		}
		if (data instanceof ArrayBuffer) {
			data = new Uint8Array(data);
		}
		if (data instanceof Uint8Array) {
			data = Array.from(data);
		}

		return unescape(encodeURIComponent(JSON.stringify(data)));
	}
}

export const requireField = (obj: { [key: string]: any }) => {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (
				typeof obj[key] === 'undefined' ||
				obj[key] === null ||
				obj[key].toString().trim() === ''
			) {
				throw new Error(`${key} missing`);
			}
		}
	}
};
