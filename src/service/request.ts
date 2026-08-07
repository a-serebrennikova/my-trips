type RequestOptions = RequestInit & {
	errorMessage: string;
};

export async function requestJson<T>(
	url: string,
	{ errorMessage, ...options }: RequestOptions,
): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(errorMessage);
	}

	return response.json() as Promise<T>;
}

export async function requestVoid(
	url: string,
	{ errorMessage, ...options }: RequestOptions,
): Promise<void> {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(errorMessage);
	}
}