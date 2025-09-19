import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Link } from "@inertiajs/react";

interface DataTableWrapperProps {
  fetchUrl: string;
  columns: any[];
  csvHeaders: any[];
  createUrl: string;
  createLabel: string;
}

export default function DataTableWrapper({
  fetchUrl,
  columns,
  csvHeaders,
  createUrl,
  createLabel,
}: DataTableWrapperProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  // 🔄 reloadData function
  const reloadData = useCallback(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
        setLoading(false);
      });
  }, [fetchUrl]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const filteredItems = data.filter(
    (item) =>
      item.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id?.toString().includes(filterText)
  );

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#d6d9ddff",
        color: "#111827",
        fontWeight: "600",
        fontSize: "14px",
      },
    },
    rows: {
      style: { fontSize: "14px" },
    },
  };

  const subHeaderComponent = (
    <div className="flex justify-between items-center w-full px-2">
      <input
        type="text"
        placeholder="Search by ID or Company"
        className="border px-3 py-2 rounded w-64"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <CSVLink
        data={filteredItems}
        headers={csvHeaders}
        filename="data.csv"
        className="ml-3 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Export CSV
      </CSVLink>
    </div>
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
      <div className="flex justify-end mb-3">
        <Link
          href={createUrl}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          {createLabel}
        </Link>
      </div>

      <div className="relative flex-1 m-5 p-5 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 shadow-md">
        <DataTable
          columns={columns.map((col) =>
            col.name === "Actions"
              ? {
                  ...col,
                  cell: (row: any) => col.cell(row, reloadData), // 👈 pass reloadData
                }
              : col
          )}
          data={filteredItems}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          subHeader
          subHeaderComponent={subHeaderComponent}
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}
