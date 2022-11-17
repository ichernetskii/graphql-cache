import { gql, request } from "graphql-request";
import { ServerResponse } from "@/ts/types";
import { Cache } from "@/ts/cache";
import { debounce } from "@/ts/utils";
import "@/css/index.scss";

const URL = "https://countries.trevorblades.com/";

const $filter = document.querySelector<HTMLInputElement>(".input__filter");
const $response = document.querySelector<HTMLDivElement>(".response");
const cache = new Cache();

const getData = async(filter: string): Promise<ServerResponse> => {
	if (filter === "") return { countries: [] };
	const cachedResponse = cache.get(filter);
	if (cachedResponse !== null) return cachedResponse;

	// Request must contain country codes which have already been cached
	// Response mustn't contain country codes which have already been cached
	const query = gql`
		query {
			countries(filter: {code: { regex: "${filter}", nin: ["${cache.getCountryCodes(filter).join("\", \"")}"] }}) {
				name
				code
			}
		}`;
	const data = await request<ServerResponse>(URL, query);
	cache.add(filter, data);
	return cache.get(filter) ?? { countries: [] };
};

const onInputHandler: EventListener = (e) => {
	if (!$response) return;
	const filter = (e.target as HTMLInputElement).value.toUpperCase();
	if (filter === "") {
		$response.innerHTML = "";
		return;
	}
	getData(filter)
		.then(({ countries }) => {
			if (countries.length === 0) {
				$response.innerHTML = "<div class='info'>No results</div>";
			} else {
				const regEx = new RegExp(`(${filter})`, "gi");
				let tableData = "<span class='table__header'>Code</span><span class='table__header'>Country</span>";
				tableData += countries
					.sort((country1, country2) => country1.code.localeCompare(country2.code))
					.map(country => `
						<span class="table__cell">${country.code.replaceAll(regEx, "<mark>$1</mark>")}</span>
						<span class="table__cell">${country.name}</span>
					`)
					.join("");
				$response.innerHTML = `<div class="table">${tableData}</div>`;
			}
		})
		.catch((e: Error) => {
			$response.innerHTML = `<div class="info info_warning">${e.message}</div>`;
		});
};

if ($filter) {
	$filter.addEventListener("input", debounce(onInputHandler));
}
