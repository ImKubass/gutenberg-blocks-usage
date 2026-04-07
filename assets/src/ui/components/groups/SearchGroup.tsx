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
  onSearchAction: (formData: FormData) => void;
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
  onSearchAction,
}: SearchGroupProps) {
  const placeholder = isLoadingBlocks
    ? loadingLabel
    : blocks.length
      ? selectBlockLabel
      : noBlocksLabel;

  const disableSelect = isLoadingBlocks || !blocks.length;
  const disableSearch = isLoadingBlocks || isSearching || !selectedBlock.trim();

  return (
    <form className="gbu-search-bar" action={onSearchAction}>
      <Select
        id="gbu-block-select"
        name="block"
        value={selectedBlock}
        disabled={disableSelect}
        options={blocks}
        placeholder={placeholder}
        onChange={onChangeBlock}
      />

      <Button
        id="gbu-search-btn"
        className="button button-primary"
        disabled={disableSearch}
        type="submit"
      >
        {searchLabel}
      </Button>
    </form>
  );
}
