type Proc<A> = (...args: A[]) => void;

export function debounce<A = any>(fn: Proc<A>, timeout: number = 500): Proc<A> {
	let timer: number;
	return (...args: A[]): void => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, timeout);
	};
}
