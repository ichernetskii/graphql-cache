import { Cache } from "./cache";

describe("Test Cache class", () => {
	let cache: Cache;

	beforeEach(() => {
		cache = new Cache({
			E: {
				countries: [
					{ code: "EE", name: "Estonia" },
					{ code: "DE", name: "Germany" },
					{ code: "EG", name: "Egypt" },
					{ code: "ES", name: "Spain" },
					{ code: "GE", name: "Georgia" },
				],
			},
			D: {
				countries: [
					{ code: "DE", name: "Germany" },
					{ code: "DK", name: "Denmark" },
					{ code: "TD", name: "Chad" },
				],
			},
			DE: {
				countries: [{ code: "DE", name: "Germany" }],
			},
			Q: {
				countries: [{ code: "QA", name: "Qatar" }],
			},
			NO: {
				countries: [{ code: "NO", name: "Norway" }],
			},
		});
	});

	it("should return all countries", () => {
		// @ts-expect-error
		expect(cache.getCountries()).toEqual([
			{ code: "EE", name: "Estonia" },
			{ code: "DE", name: "Germany" },
			{ code: "EG", name: "Egypt" },
			{ code: "ES", name: "Spain" },
			{ code: "GE", name: "Georgia" },
			{ code: "DK", name: "Denmark" },
			{ code: "TD", name: "Chad" },
			{ code: "QA", name: "Qatar" },
			{ code: "NO", name: "Norway" },
		]);
	});

	it("should return countries by filter", () => {
		expect(cache.get("")).toEqual(null);
		expect(cache.get("DE")?.countries).toEqual([
			{ code: "DE", name: "Germany" },
		]);

		expect(cache.get("QQ")?.countries).toEqual([]);

		expect(cache.get("QA")?.countries).toEqual([
			{ code: "QA", name: "Qatar" },
		]);

		expect(cache.get("G")).toEqual(null);
	});

	it("should add cached countries", () => {
		cache.add("G", {
			countries: [
				{ code: "BG", name: "Bulgaria" },
				{ code: "GB", name: "United Kingdom" },
			],
		});
		expect(cache.get("G")).toEqual({
			countries: [
				{ code: "EG", name: "Egypt" },
				{ code: "GE", name: "Georgia" },
				{ code: "BG", name: "Bulgaria" },
				{ code: "GB", name: "United Kingdom" },
			],
		});
	});

	it("should add cached countries with overlap", () => {
		cache.add("G", {
			countries: [
				{ code: "EG", name: "Egypt" },
				{ code: "BG", name: "Bulgaria" },
				{ code: "GB", name: "United Kingdom" },
			],
		});
		expect(cache.get("G")).toEqual({
			countries: [
				{ code: "EG", name: "Egypt" },
				{ code: "GE", name: "Georgia" },
				{ code: "BG", name: "Bulgaria" },
				{ code: "GB", name: "United Kingdom" },
			],
		});
	});

	it("should add without cached countries", () => {
		cache.add("Y", {
			countries: [
				{ code: "MY", name: "Malaysia" },
				{ code: "PY", name: "Paraguay" },
			],
		});
		expect(cache.get("Y")).toEqual({
			countries: [
				{ code: "MY", name: "Malaysia" },
				{ code: "PY", name: "Paraguay" },
			],
		});
	});

	it("should return cached country codes", () => {
		expect(cache.getCountryCodes()).toEqual(
			["EE", "DE", "EG", "ES", "GE", "DK", "TD", "QA", "NO"],
		);

		expect(cache.getCountryCodes("E")).toEqual(
			["EE", "DE", "EG", "ES", "GE"],
		);

		expect(cache.getCountryCodes("DE")).toEqual(
			["DE"],
		);
	});
});
