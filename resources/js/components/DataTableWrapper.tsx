import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Link } from "@inertiajs/react";
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

interface FilterOption {
  value: string;
  label: string;
}

interface AdditionalFilter {
  name: string;
  label: string;
  type: "select" | "text";
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

interface ApiResponse {
  data: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
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
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔄 Reload Data with pagination
  const reloadData = useCallback(async (page: number = currentPage, limit: number = perPage) => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', limit.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    if (filterText) {
      params.append('search', filterText);
    }

    try {
      const url = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${params.toString()}`;
      const response = await fetch(url);
      const result: ApiResponse = await response.json();

      setData(result.data || []);
      setTotalRows(result.total || 0);
      setCurrentPage(result.current_page || 1);
      setPerPage(result.per_page || 10);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [fetchUrl, filters, filterText, currentPage, perPage]);

  // Initial load
  useEffect(() => {
    reloadData(1, perPage);
  }, []);

  // Reload when filters or search change
  useEffect(() => {
    reloadData(1, perPage);
  }, [filters, filterText]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reloadData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    reloadData(1, newPerPage);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Client-side filtering for CSV/PDF export only
  const filteredItemsForExport = data.filter(
    (item) =>
      item.company?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id?.toString().includes(filterText)
  );

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#e5e7eb",
        color: "#111827",
        fontWeight: "600",
        fontSize: "14px",
        borderBottom: "1px solid #d1d5db",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
        "&:nth-of-type(odd)": {
          backgroundColor: "#f9fafb",
        },
        "&:hover": {
          backgroundColor: "#f3f4f6",
          cursor: "pointer",
        },
      },
    },
    cells: {
      style: {
        color: "#374151",
        padding: "12px 16px",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        color: "#374151",
      },
    },
  };

  const darkCustomStyles = {
    table: {
      style: {
        backgroundColor: "#1e293b",
        color: "#e2e8f0",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#334155",
        borderBottom: "2px solid #475569",
        minHeight: "52px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#334155",
        color: "#f1f5f9",
        fontWeight: "700",
        fontSize: "14px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRight: "1px solid #475569",
        "&:last-of-type": {
          borderRight: "none",
        },
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        backgroundColor: "#1e293b",
        color: "#e2e8f0",
        minHeight: "56px",
        borderBottom: "1px solid #334155",
        "&:nth-of-type(odd)": {
          backgroundColor: "#0f172a",
        },
        "&:hover": {
          backgroundColor: "#334155",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#334155",
        borderBottomColor: "#475569",
        outline: "none",
      },
      stripedStyle: {
        backgroundColor: "#0f172a",
      },
    },
    cells: {
      style: {
        color: "#cbd5e1",
        paddingLeft: "16px",
        paddingRight: "16px",
        fontSize: "14px",
        borderRight: "1px solid #334155",
        "&:last-of-type": {
          borderRight: "none",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: "#1e293b",
        color: "#e2e8f0",
        borderTop: "2px solid #334155",
        minHeight: "56px",
      },
      pageButtonsStyle: {
        borderRadius: "6px",
        height: "36px",
        width: "36px",
        padding: "8px",
        margin: "0 4px",
        cursor: "pointer",
        transition: "all 0.2s",
        color: "#94a3b8",
        fill: "#94a3b8",
        backgroundColor: "transparent",
        "&:disabled": {
          cursor: "not-allowed",
          color: "#475569",
          fill: "#475569",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "#334155",
          color: "#e2e8f0",
          fill: "#e2e8f0",
        },
        "&:focus": {
          outline: "none",
          backgroundColor: "#334155",
        },
      },
    },
    noData: {
      style: {
        backgroundColor: "#1e293b",
        color: "#94a3b8",
      },
    },
    progress: {
      style: {
        backgroundColor: "#1e293b",
      },
    },
    rowsPerPageDropdown: {
      style: {
        backgroundColor: '#1f2937', // gray-800
        color: '#f9fafb',
      },
    },
  };

  // helper function to resolve nested keys like "user.name"
  const resolveKey = (obj: any, key: string) => {
    return key.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : ""), obj);
  };

  // 🧾 PDF Export Function
  const exportPDF = (openInNewTab = false) => {
    const doc = new jsPDF();

    // --- Prepare Table Data ---
    const tableColumn = csvHeaders.map((h) => h.label);
    const tableRows = filteredItemsForExport.map((row) =>
      csvHeaders.map((h) => resolveKey(row, h.key))
    );

    // --- Add Logo ---
    const img = new Image();
    img.src = "/logo.png";
    img.onload = () => {
      doc.addImage(img, "PNG", 14, 10, 40, 15);

      // --- Add Title & Date ---
      doc.setFontSize(12);
      doc.text("Report", 60, 20);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 60, 26);

      // --- Add Table ---
      (autoTable as any)(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 220, 220] },
      });

      // --- Save or Open ---
      if (openInNewTab) {
        const blob = doc.output("bloburl");
        window.open(blob);
      } else {
        doc.save("orders.pdf");
      }
    };
  };

  const subHeaderComponent = (
    <div className="flex flex-col gap-4 w-full p-4 bg-slate-800/50 dark:bg-slate-900/50 rounded-t-xl border-b border-slate-700">
      {/* Filters */}
      {additionalFilters.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {additionalFilters.map((filter) => (
            <div key={filter.name} className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 whitespace-nowrap">
                {filter.label}:
              </label>
              {filter.type === "select" && filter.options ? (
                <select
                  value={filters[filter.name] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.name, e.target.value)
                  }
                  className="border border-gray-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  value={filters[filter.name] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.name, e.target.value)
                  }
                  className="border border-gray-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={`Filter by ${filter.label}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Search + Export */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by ID, Company, or Client"
          className="border border-gray-300 dark:border-slate-600 px-4 py-2.5 rounded-lg flex-1 min-w-[280px] bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <div className="flex gap-2">
          <CSVLink
            data={filteredItemsForExport.map((row) => {
              const newRow: Record<string, any> = {};
              csvHeaders.forEach((h) => {
                newRow[h.key] = resolveKey(row, h.key);
              });
              return newRow;
            })}
            headers={csvHeaders}
            filename="data.csv"
            className="rounded-lg bg-green-600 px-4 py-2.5 text-white font-medium hover:bg-green-700 active:bg-green-800 transition-all shadow-md hover:shadow-lg"
          >
            Export CSV
          </CSVLink>
          <button
            onClick={() => exportPDF(false)}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-white font-medium hover:bg-red-700 active:bg-red-800 transition-all shadow-md hover:shadow-lg"
          >
            Export PDF
          </button>

          <button
            onClick={() => exportPDF(true)}
            className="rounded-lg bg-slate-600 px-4 py-2.5 text-white font-medium hover:bg-slate-700 active:bg-slate-800 transition-all shadow-md hover:shadow-lg"
          >
            View PDF
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
      {/* Create button */}
      {createUrl && createLabel && (
        <div className="flex justify-end mb-3">
          <Link
            href={createUrl}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium shadow-md hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg transition-all"
          >
            {createLabel}
          </Link>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
        <DataTable
          columns={columns.map((col) =>
            col.name === "Actions"
              ? {
                ...col,
                cell: (row: any) => col.cell(row, reloadData),
              }
              : col
          )}
          data={data}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          highlightOnHover
          striped
          responsive
          subHeader
          subHeaderComponent={subHeaderComponent}
          customStyles={document.documentElement.classList.contains('dark') ? darkCustomStyles : customStyles}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </div>
    </div>
  );
}