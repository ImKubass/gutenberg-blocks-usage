import { useActionState, useEffect, useState } from "react";
import { apiFetch } from "@root/ui/api";
import { ResultsGroup } from "@components/groups/ResultsGroup";
import { SearchGroup } from "@components/groups/SearchGroup";
import { __, sprintf } from "@wordpress/i18n";
import type { GbuConfig, UsageResponse } from "@root/ui/types";

type AppProps = {
  config: GbuConfig;
};

const I18N_DOMAIN = "gutenberg-blocks-usage";

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
          errorMessage: __("An error occurred. Please try again.", I18N_DOMAIN),
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
        setLoadErrorMessage(
          __("An error occurred. Please try again.", I18N_DOMAIN),
        );
      } finally {
        setIsLoadingBlocks(false);
      }
    };

    void loadBlocks();
  }, [apiBase, nonce]);

  const foundIn = sprintf(
    __("Found in %d post(s):", I18N_DOMAIN),
    searchState.usage?.total ?? 0,
  );

  return (
    <>
      <SearchGroup
        blocks={blocks}
        selectedBlock={selectedBlock}
        isLoadingBlocks={isLoadingBlocks}
        isSearching={isSearching}
        loadingLabel={__("Loading…", I18N_DOMAIN)}
        noBlocksLabel={__("No blocks found in the database.", I18N_DOMAIN)}
        selectBlockLabel={__("Select a block…", I18N_DOMAIN)}
        searchLabel={__("Search", I18N_DOMAIN)}
        onChangeBlock={setSelectedBlock}
        onSearchAction={runSearchAction}
      />

      <ResultsGroup
        isSearching={isSearching}
        errorMessage={loadErrorMessage || searchState.errorMessage}
        searchedBlock={searchState.searchedBlock}
        usage={searchState.usage}
        noResultsLabel={__("This block is not used anywhere.", I18N_DOMAIN)}
        foundInLabel={foundIn}
        tableLabels={{
          title: __("Title", I18N_DOMAIN),
          type: __("Type", I18N_DOMAIN),
          status: __("Status", I18N_DOMAIN),
          occurrences: __("Occurrences", I18N_DOMAIN),
          actions: __("Actions", I18N_DOMAIN),
          edit: __("Edit", I18N_DOMAIN),
          view: __("View", I18N_DOMAIN),
        }}
      />
    </>
  );
}
