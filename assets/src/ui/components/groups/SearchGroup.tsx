import { Button } from "../core/Button";
import { Select } from "../core/Select";

type SearchGroupProps = {
  blocks: string[];
  selectedBlock: string;
  isLoadingBlocks: boolean;
  isSearching: boolean;
  loadingLabel: string;
  noBlocksLabel: string;
  selectBlockLabel: string;
  searchLabel: string;
  onChangeBlock: (value: string) => void;
  onSearch: () => void;
};

export function SearchGroup({
  blocks,
  selectedBlock,
  isLoadingBlocks,
  isSearching,
  loadingLabel,
  noBlocksLabel,
  selectBlockLabel,
  searchLabel,
  onChangeBlock,
  onSearch,
}: SearchGroupProps) {
  const placeholder = isLoadingBlocks
    ? loadingLabel
    : blocks.length
      ? selectBlockLabel
      : noBlocksLabel;

  const disableSelect = isLoadingBlocks || !blocks.length;
  const disableSearch = isLoadingBlocks || isSearching || !selectedBlock.trim();

  return (
    <div className="gbu-search-bar">
      <Select
        id="gbu-block-select"
        value={selectedBlock}
        disabled={disableSelect}
        options={blocks}
        placeholder={placeholder}
        onChange={onChangeBlock}
        onEnter={onSearch}
      />

      <Button
        id="gbu-search-btn"
        className="button button-primary"
        disabled={disableSearch}
        onClick={onSearch}
      >
        {searchLabel}
      </Button>
    </div>
  );
}
