export interface Country {
	name: string;
	code: string;
}

export interface ServerResponse {
	countries: Country[];
}
