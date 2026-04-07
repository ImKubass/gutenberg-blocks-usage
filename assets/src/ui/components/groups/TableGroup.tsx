import { Chip } from "../core/Chip";
import type { UsageItem } from "../../types";

type TableGroupProps = {
  items: UsageItem[];
  labels: {
    title: string;
    type: string;
    status: string;
    occurrences: string;
    actions: string;
    edit: string;
    view: string;
  };
};

export function TableGroup({ items, labels }: TableGroupProps) {
  return (
    <table className="gbu-table">
      <thead>
        <tr>
          <th>#</th>
          <th>{labels.title}</th>
          <th>{labels.type}</th>
          <th>{labels.status}</th>
          <th>{labels.occurrences}</th>
          <th>{labels.actions}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const statusClass =
            item.post_status === "publish" ? " gbu-status-publish" : "";

          return (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>
                <Chip className="gbu-post-type">{item.post_type}</Chip>
              </td>
              <td>
                <Chip className={`gbu-status${statusClass}`}>
                  {item.post_status}
                </Chip>
              </td>
              <td>
                <Chip className="gbu-badge">{item.occurrences}</Chip>
              </td>
              <td className="gbu-actions">
                {!!item.edit_url && <a href={item.edit_url}>{labels.edit}</a>}
                {!!item.view_url && (
                  <a href={item.view_url} target="_blank" rel="noopener">
                    {labels.view}
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
