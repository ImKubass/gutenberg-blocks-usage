/// <reference lib="dom" />

type GbuI18n = {
  loading: string;
  select_block: string;
  no_blocks: string;
  no_results: string;
  error: string;
  found_in: string;
  occurrences: string;
  edit: string;
  view: string;
};

type GbuConfig = {
  apiBase: string;
  nonce: string;
  i18n: GbuI18n;
};

type UsageItem = {
  id: number;
  title: string;
  post_type: string;
  post_status: string;
  occurrences: number;
  edit_url: string;
  view_url: string;
};

type UsageResponse = {
  total: number;
  items: UsageItem[];
};

declare const GBU: GbuConfig;

const api = GBU.apiBase;
const nonce = GBU.nonce;
const i18n = GBU.i18n;

const selectEl = document.getElementById(
  "gbu-block-select",
) as HTMLSelectElement | null;
const searchBtn = document.getElementById(
  "gbu-search-btn",
) as HTMLButtonElement | null;
const resultsEl = document.getElementById(
  "gbu-results",
) as HTMLDivElement | null;

if (!selectEl || !searchBtn || !resultsEl) {
  throw new Error("GBU: Required admin UI elements were not found.");
}

const escapeHtml = (value: unknown): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const setLoading = (loading: boolean): void => {
  searchBtn.disabled = loading;
  if (loading) {
    resultsEl.innerHTML =
      '<span class="gbu-spinner" aria-hidden="true"></span>';
  }
};

const apiFetch = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      "X-WP-Nonce": nonce,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Request failed");
  }

  return (await response.json()) as T;
};

const loadBlocks = async (): Promise<void> => {
  try {
    const blocks = await apiFetch<string[]>(`${api}/blocks`);
    selectEl.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";

    if (!blocks.length) {
      placeholder.textContent = i18n.no_blocks;
      selectEl.appendChild(placeholder);
      return;
    }

    placeholder.textContent = i18n.select_block;
    selectEl.appendChild(placeholder);

    for (const blockName of blocks) {
      const option = document.createElement("option");
      option.value = blockName;
      option.textContent = blockName;
      selectEl.appendChild(option);
    }

    selectEl.disabled = false;
    searchBtn.disabled = false;
  } catch {
    selectEl.innerHTML = `<option value="">${escapeHtml(i18n.error)}</option>`;
  }
};

const renderResults = (blockName: string, data: UsageResponse): void => {
  let html = '<p class="gbu-results-summary">';
  html += i18n.found_in.replace(
    "%d",
    `<span class="gbu-count">${escapeHtml(data.total)}</span>`,
  );
  html += ` &nbsp; <span class="gbu-block-name">${escapeHtml(blockName)}</span>`;
  html += "</p>";

  if (!data.total) {
    html += `<div class="gbu-notice gbu-notice-info">${escapeHtml(i18n.no_results)}</div>`;
    resultsEl.innerHTML = html;
    return;
  }

  html +=
    '<table class="gbu-table">' +
    "<thead><tr>" +
    "<th>#</th>" +
    "<th>Title</th>" +
    "<th>Type</th>" +
    "<th>Status</th>" +
    "<th>Occurrences</th>" +
    "<th>Actions</th>" +
    "</tr></thead><tbody>";

  data.items.forEach((item, index) => {
    const statusClass =
      item.post_status === "publish" ? " gbu-status-publish" : "";
    html += "<tr>";
    html += `<td>${escapeHtml(index + 1)}</td>`;
    html += `<td>${escapeHtml(item.title)}</td>`;
    html += `<td><span class="gbu-post-type">${escapeHtml(item.post_type)}</span></td>`;
    html += `<td><span class="gbu-status${statusClass}">${escapeHtml(item.post_status)}</span></td>`;
    html += `<td><span class="gbu-badge">${escapeHtml(item.occurrences)}</span></td>`;
    html += '<td class="gbu-actions">';

    if (item.edit_url) {
      html += `<a href="${escapeHtml(item.edit_url)}">${escapeHtml(i18n.edit)}</a>`;
    }
    if (item.view_url) {
      html += `<a href="${escapeHtml(item.view_url)}" target="_blank" rel="noopener">${escapeHtml(i18n.view)}</a>`;
    }

    html += "</td></tr>";
  });

  html += "</tbody></table>";
  resultsEl.innerHTML = html;
};

const runSearch = async (blockName: string): Promise<void> => {
  setLoading(true);

  try {
    const data = await apiFetch<UsageResponse>(
      `${api}/usage?block=${encodeURIComponent(blockName)}`,
    );
    renderResults(blockName, data);
  } catch {
    resultsEl.innerHTML = `<div class="gbu-notice gbu-notice-error">${escapeHtml(i18n.error)}</div>`;
  } finally {
    searchBtn.disabled = false;
  }
};

searchBtn.addEventListener("click", () => {
  const blockName = selectEl.value.trim();
  if (!blockName) {
    return;
  }
  void runSearch(blockName);
});

selectEl.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter" && selectEl.value) {
    void runSearch(selectEl.value.trim());
  }
});

void loadBlocks();
