import { debounce } from "./utils";

describe("Test utils", () => {
	it("should runs only once", done => {
		const fn = jest.fn();
		const debouncedFn = debounce(fn, 100);
		debouncedFn();
		debouncedFn();
		setTimeout(() => {
			debouncedFn();
			setTimeout(() => {
				expect(fn).toHaveBeenCalledTimes(1);
				done();
			}, 150);
		}, 50);
	});

	it("should runs twice", done => {
		const fn = jest.fn();
		const debouncedFn = debounce(fn, 100);
		debouncedFn();
		setTimeout(() => {
			debouncedFn();
			setTimeout(() => {
				expect(fn).toHaveBeenCalledTimes(2);
				done();
			}, 150);
		}, 150);
	});
});
