export const apiFetch = async <T>(url: string, nonce: string): Promise<T> => {
	const response = await fetch(url, {
		headers: {
			"X-WP-Nonce": nonce,
			Accept: "application/json",
		},
	})

	if (!response.ok) {
		throw new Error(response.statusText || "Request failed")
	}

	return (await response.json()) as T
}
