import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import { ResultsGroup } from "./components/groups/ResultsGroup";
import { SearchGroup } from "./components/groups/SearchGroup";
import { __, sprintf } from "@wordpress/i18n";
import type { GbuConfig, UsageResponse } from "./types";

type AppProps = {
  config: GbuConfig;
};

export function App({ config }: AppProps) {
  const { apiBase, nonce } = config;

  const [blocks, setBlocks] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [searchedBlock, setSearchedBlock] = useState<string>("");
  const [isLoadingBlocks, setIsLoadingBlocks] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const response = await apiFetch<string[]>(`${apiBase}/blocks`, nonce);
        setBlocks(response);
      } catch {
        setErrorMessage(__("An error occurred. Please try again."));
      } finally {
        setIsLoadingBlocks(false);
      }
    };

    void loadBlocks();
  }, [apiBase, nonce]);

  const runSearch = async () => {
    const blockName = selectedBlock.trim();
    if (!blockName) {
      return;
    }

    setIsSearching(true);
    setErrorMessage("");

    try {
      const data = await apiFetch<UsageResponse>(
        `${apiBase}/usage?block=${encodeURIComponent(blockName)}`,
        nonce,
      );
      setSearchedBlock(blockName);
      setUsage(data);
    } catch {
      setErrorMessage(__("An error occurred. Please try again."));
      setUsage(null);
    } finally {
      setIsSearching(false);
    }
  };

  const foundIn = sprintf(__("Found in %d post(s):"), usage?.total ?? 0);

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
        onSearch={() => {
          void runSearch();
        }}
      />

      <ResultsGroup
        isSearching={isSearching}
        errorMessage={errorMessage}
        searchedBlock={searchedBlock}
        usage={usage}
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
