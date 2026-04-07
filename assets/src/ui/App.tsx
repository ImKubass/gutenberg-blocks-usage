import { useActionState, useEffect, useState } from "react";
import { apiFetch } from "./api";
import { ResultsGroup } from "./components/groups/ResultsGroup";
import { SearchGroup } from "./components/groups/SearchGroup";
import { __, sprintf } from "@wordpress/i18n";
import type { GbuConfig, UsageResponse } from "./types";

type AppProps = {
  config: GbuConfig;
};

type SearchState = {
  usage: UsageResponse | null;
  searchedBlock: string;
  errorMessage: string;
};

const initialSearchState: SearchState = {
  usage: null,
  searchedBlock: "",
  errorMessage: "",
};

export function App({ config }: AppProps) {
  const { apiBase, nonce } = config;

  const [blocks, setBlocks] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [isLoadingBlocks, setIsLoadingBlocks] = useState<boolean>(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string>("");

  const [searchState, runSearchAction, isSearching] = useActionState(
    async (
      _previousState: SearchState,
      formData: FormData,
    ): Promise<SearchState> => {
      const blockName = String(formData.get("block") ?? "");
      const normalizedBlock = blockName.trim();

      if (!normalizedBlock) {
        return initialSearchState;
      }

      try {
        const usage = await apiFetch<UsageResponse>(
          `${apiBase}/usage?block=${encodeURIComponent(normalizedBlock)}`,
          nonce,
        );

        return {
          usage,
          searchedBlock: normalizedBlock,
          errorMessage: "",
        };
      } catch {
        return {
          usage: null,
          searchedBlock: normalizedBlock,
          errorMessage: __("An error occurred. Please try again."),
        };
      }
    },
    initialSearchState,
  );

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const response = await apiFetch<string[]>(`${apiBase}/blocks`, nonce);
        setBlocks(response);
      } catch {
        setLoadErrorMessage(__("An error occurred. Please try again."));
      } finally {
        setIsLoadingBlocks(false);
      }
    };

    void loadBlocks();
  }, [apiBase, nonce]);

  const foundIn = sprintf(
    __("Found in %d post(s):"),
    searchState.usage?.total ?? 0,
  );

  return (
    <>
      <SearchGroup
        blocks={blocks}
        selectedBlock={selectedBlock}
        isLoadingBlocks={isLoadingBlocks}
        isSearching={isSearching}
        loadingLabel={__("Loading…")}
        noBlocksLabel={__("No blocks found in the database.")}
        selectBlockLabel={__("Select a block…")}
        searchLabel={__("Search")}
        onChangeBlock={setSelectedBlock}
        onSearchAction={runSearchAction}
      />

      <ResultsGroup
        isSearching={isSearching}
        errorMessage={loadErrorMessage || searchState.errorMessage}
        searchedBlock={searchState.searchedBlock}
        usage={searchState.usage}
        noResultsLabel={__("This block is not used anywhere.")}
        foundInLabel={foundIn}
        tableLabels={{
          title: __("Title"),
          type: __("Type"),
          status: __("Status"),
          occurrences: __("Occurrences"),
          actions: __("Actions"),
          edit: __("Edit"),
          view: __("View"),
        }}
      />
    </>
  );
}
