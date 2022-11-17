import { Country, ServerResponse } from "@/ts/types";

export class Cache {
	constructor(private readonly cache: Record<string, ServerResponse> = {}) {}

	private getCountries(): Country[] {
		return Object
			.values(this.cache)
			.map(response => response.countries)
			.flat()
			// filter out duplicates
			.reduce<Country[]>((acc, country) => {
				if (!acc.some(({ code }) => code === country.code)) {
					acc.push(country);
				}
				return acc;
			}, []);
	}

	// Gets a response from the cache
	// If part of request to server (filter) was cached, the response will get data from cache
	public get(filter: string): ServerResponse | null {
		const cacheKeys = Object.keys(this.cache);

		// check if exact this key has already been stored in cache
		if (cacheKeys.includes(filter)) return this.cache[filter];

		for (const key of cacheKeys) {
			// check if filter contains any key
			if (filter.includes(key)) {
				// filter out countries that don't match the filter
				const countries = this
					.cache[key]
					.countries
					.filter(({ code }) => code.includes(filter));

				if (countries.length === 0) return { countries: [] }; // if there are no countries, return null

				return { countries };
			}
		}
		return null; // not found in cache
	}

	// Adds a new response to the cache
	// If request to server was truncated because of cached data, the response will be merged with the cached data
	public add(filter: string, response: ServerResponse): void {
		const cachedCountries = this.getCountries().filter(({ code }) => code.includes(filter));
		// server can return data without cached countries (because we can make a request with a filter)
		this.cache[filter] = {
			countries: [...cachedCountries, ...response.countries]
				// delete duplicates
				.reduce<Country[]>((acc, country) => {
					if (!acc.some(({ code }) => code === country.code)) {
						acc.push(country);
					}
					return acc;
				}, []),
		};
	}

	public getCountryCodes(filter?: string): string[] {
		return Array.from(new Set( // delete duplicates
			Object
				.values(this.cache)
				.map(({ countries }) => countries.map(country => country.code))
				.flat()
				.filter(code => !filter || code.includes(filter)),
		));
	}
}
