import { compressToUTF16, decompressFromUTF16 } from 'lz-string'
import { get, set } from 'lodash'

export class StorageManager<V> {
	private compressionStrategy = compressToUTF16;
	private decompressionStrategy = decompressFromUTF16;
	private _vault: V = {} as any

	constructor(private engine: Storage, private storeKey: string) {
		this.read()
	}

	public fetch(): V {
		return this._vault ?? {} as any
	}
	public find<T>(path: string): T {
		return get(this._vault, path)
	}
	public set(path: string, value: Partial<V>) {
		const update = set<any>({ ...this.read() }, path, value)
		this.write(update)
	}

	private read(): V {
		try {
			const decompressed = this.decompress(
				this.engine.getItem(this.storeKey) ?? '',
			)
			if (this.isFreshData(decompressed)) {
				this._vault = decompressed
			}
		} catch (error) {
			// do nothing
		}
		return this.fetch()
	}
	private write(data: any) {
		if (!this.isFreshData(data)) {
			return
		}
		this._vault = data
		this.engine.setItem(this.storeKey, this.compress(data))
	}

	private hash(data: any = this._vault) {
		const str = this.toSafeString(data)
		let hash = 0
		for (let i = 0; i < str.length; i++) {
			const character = str.charCodeAt(i)
			hash = (hash << 5) - hash + character
			hash = hash & hash // Convert to 32bit integer
		}
		return hash
	}
	private compress(data: any): string {
		return this.compressionStrategy(this.toSafeString(data))
	}
	private decompress(str: string) {
		const decompressed = this.decompressionStrategy(str)
		if (decompressed !== null) {
			return JSON.parse(decompressed)
		}
	}

	private isFreshData(data: any) {
		return !this._vault || this.hash() !== this.hash(data)
	}
	private toSafeString(data: any) {
		return unescape(encodeURIComponent(JSON.stringify(data)));
	}
}
