export type GbuConfig = {
	apiBase: string
	nonce: string
}

export type UsageItem = {
	id: number
	title: string
	post_type: string
	post_status: string
	occurrences: number
	edit_url: string
	view_url: string
}

export type UsageResponse = {
	total: number
	items: UsageItem[]
}
