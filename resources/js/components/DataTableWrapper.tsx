import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Link } from "@inertiajs/react";

interface FilterOption {
  value: string;
  label: string;
}

interface AdditionalFilter {
  name: string;
  label: string;
  type: 'select' | 'text';
  options?: FilterOption[];
}

interface DataTableWrapperProps {
  fetchUrl: string;
  columns: any[];
  csvHeaders: any[];
  createUrl?: string;
  createLabel?: string;
  additionalFilters?: AdditionalFilter[];
}

export default function DataTableWrapper({
  fetchUrl,
  columns,
  csvHeaders,
  createUrl,
  createLabel,
  additionalFilters = [],
}: DataTableWrapperProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // 🔄 reloadData function
  const reloadData = useCallback(() => {
    setLoading(true);
    
    // Build query params from filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    const url = params.toString() ? `${fetchUrl}?${params}` : fetchUrl;
    
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [fetchUrl, filters]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredItems = data.filter(
    (item) =>
      item.company?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
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
    <div className="flex flex-col gap-3 w-full px-2">
      {/* Additional Filters Row */}
      {additionalFilters.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {additionalFilters.map((filter) => (
            <div key={filter.name} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                {filter.label}:
              </label>
              {filter.type === 'select' && filter.options ? (
                <select
                  value={filters[filter.name] || ''}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded text-sm"
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters[filter.name] || ''}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded text-sm"
                  placeholder={`Filter by ${filter.label}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Search and Export Row */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by ID, Company, or Client"
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
    </div>
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
      {/* Conditionally render create button */}
      {createUrl && createLabel && (
        <div className="flex justify-end mb-3">
          <Link
            href={createUrl}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
          >
            {createLabel}
          </Link>
        </div>
      )}

      <div className="relative flex-1 m-5 p-5 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 shadow-md">
        <DataTable
          columns={columns.map((col) =>
            col.name === "Actions"
              ? {
                  ...col,
                  cell: (row: any) => col.cell(row, reloadData),
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