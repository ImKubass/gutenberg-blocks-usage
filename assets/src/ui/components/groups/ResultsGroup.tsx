import { Notice } from "@components/core/Notice"
import { Spinner } from "@components/core/Spinner"
import { TableGroup } from "@components/groups/TableGroup"
import type { UsageResponse } from "@root/ui/types"

type ResultsGroupProps = {
	isSearching: boolean
	errorMessage: string
	searchedBlock: string
	usage: UsageResponse | null
	noResultsLabel: string
	foundInLabel: string
	tableLabels: {
		title: string
		type: string
		status: string
		occurrences: string
		actions: string
		edit: string
		view: string
	}
}

export function ResultsGroup({
	isSearching,
	errorMessage,
	searchedBlock,
	usage,
	noResultsLabel,
	foundInLabel,
	tableLabels,
}: ResultsGroupProps) {
	return (
		<div id="gbu-results" className="gbu-results" aria-live="polite">
			{isSearching && <Spinner />}

			{!isSearching && !!errorMessage && (
				<Notice variant="error">{errorMessage}</Notice>
			)}

			{!isSearching && usage && (
				<>
					<p className="gbu-results-summary">
						{foundInLabel}{" "}
						<span className="gbu-block-name">{searchedBlock}</span>
					</p>

					{!usage.total && <Notice variant="info">{noResultsLabel}</Notice>}

					{!!usage.total && (
						<TableGroup items={usage.items} labels={tableLabels} />
					)}
				</>
			)}
		</div>
	)
}
