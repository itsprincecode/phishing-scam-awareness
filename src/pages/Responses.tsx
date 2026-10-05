import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  Search,
  Download,
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Code2
} from 'lucide-react';
import {
  fetchGoogleSheetData,
  EMPTY_SHEET_DATA,
  SheetResponseData,
  getSavedSheetUrl,
  saveSheetUrl,
  PERMANENT_GOOGLE_SHEET_URL
} from '../lib/googleSheets';

export const Responses: React.FC = () => {
  const [activeSheetUrl, setActiveSheetUrl] = useState<string>(() => getSavedSheetUrl());
  const [data, setData] = useState<SheetResponseData>(EMPTY_SHEET_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Search & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<'table' | 'analytics'>('table');
  const [mobileLayout, setMobileLayout] = useState<'table' | 'cards'>('table');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Close column dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync visible columns when headers change
  useEffect(() => {
    if (data.headers.length > 0) {
      setVisibleColumns(data.headers);
    }
  }, [data.headers]);

  // Load data from URL
  const loadSheet = useCallback(async (url: string) => {
    const targetUrl = url.trim();
    if (!targetUrl) {
      setData(EMPTY_SHEET_DATA);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const responseData = await fetchGoogleSheetData(targetUrl);
      setData(responseData);
      saveSheetUrl(targetUrl);
      setActiveSheetUrl(targetUrl);
      setCurrentPage(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to Google Sheet';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on page mount
  useEffect(() => {
    const saved = getSavedSheetUrl();
    if (saved) {
      loadSheet(saved);
    }
  }, [loadSheet]);

  // Auto-refresh interval (every 20s if enabled)
  useEffect(() => {
    if (!autoRefresh || !activeSheetUrl) return;

    const interval = setInterval(() => {
      loadSheet(activeSheetUrl);
    }, 20000);

    return () => clearInterval(interval);
  }, [autoRefresh, activeSheetUrl, loadSheet]);

  // Toggle column visibility
  const toggleColumnVisibility = (header: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(header)) {
        if (prev.length <= 1) return prev; // Always keep at least 1 column
        return prev.filter((h) => h !== header);
      } else {
        return [...prev, header];
      }
    });
  };

  const showAllColumns = () => {
    setVisibleColumns(data.headers);
  };

  const hideOtherColumns = (targetHeader: string) => {
    setVisibleColumns([targetHeader]);
  };

  // Handle column header sorting
  const handleSort = (column: string) => {
    setSortConfig((prev) => {
      if (prev?.key === column) {
        if (prev.direction === 'asc') return { key: column, direction: 'desc' };
        return null; // reset to original
      }
      return { key: column, direction: 'asc' };
    });
  };

  // Filtered & Sorted rows
  const displayedHeaders = useMemo(() => {
    if (visibleColumns.length === 0) return data.headers;
    return data.headers.filter((h) => visibleColumns.includes(h));
  }, [data.headers, visibleColumns]);

  const filteredAndSortedRows = useMemo(() => {
    let rows = data.rows;

    // 1. Text Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter((row) => {
        if (selectedColumnFilter !== 'all') {
          const val = row[selectedColumnFilter] || '';
          return val.toLowerCase().includes(term);
        }
        return Object.values(row).some((val) => val.toLowerCase().includes(term));
      });
    }

    // 2. Sorting
    if (sortConfig) {
      rows = [...rows].sort((a, b) => {
        const aVal = (a[sortConfig.key] || '').trim();
        const bVal = (b[sortConfig.key] || '').trim();

        // Check if numeric
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!isNaN(aNum) && !isNaN(bNum) && aVal !== '' && bVal !== '') {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Check if date/time
        const aDate = Date.parse(aVal);
        const bDate = Date.parse(bVal);
        if (!isNaN(aDate) && !isNaN(bDate) && aVal.length > 5) {
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }

        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    return rows;
  }, [data.rows, searchTerm, selectedColumnFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRows.length / rowsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedRows.slice(start, start + rowsPerPage);
  }, [filteredAndSortedRows, currentPage, rowsPerPage]);

  // Export to CSV
  const handleExportCSV = () => {
    if (data.headers.length === 0 || data.rows.length === 0) return;

    const headersToExport = displayedHeaders.length > 0 ? displayedHeaders : data.headers;

    const csvContent = [
      headersToExport.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...data.rows.map((row) =>
        headersToExport.map((h) => `"${(row[h] || '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `google_form_responses_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute question distribution for analytics tab
  const analyticsData = useMemo(() => {
    if (data.headers.length === 0 || data.rows.length === 0) return [];

    const columnsToAnalyze = displayedHeaders.filter(
      (h) => !h.toLowerCase().includes('timestamp') && !h.toLowerCase().includes('time')
    );

    const targetColumns = columnsToAnalyze.length > 0 ? columnsToAnalyze : displayedHeaders;

    return targetColumns.map((header) => {
      const counts: Record<string, number> = {};
      data.rows.forEach((r) => {
        const val = (r[header] || 'Unspecified').trim();
        counts[val] = (counts[val] || 0) + 1;
      });

      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const topAnswer = entries[0]?.[0] || 'N/A';
      const topCount = entries[0]?.[1] || 0;

      return {
        header,
        entries,
        total: data.rows.length,
        topAnswer,
        topCount,
      };
    });
  }, [data, displayedHeaders]);

  return (
    <div className="relative min-h-screen pt-4 pb-20">
      {/* Background radial accent */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,_rgba(180,244,55,0.08)_0%,_rgba(100,160,30,0.02)_40%,_transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ============================================================= */}
        {/* HEADER SECTION (CLEAN, NO LINK INPUT BAR)                     */}
        {/* ============================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4F437]/10 border border-[#B4F437]/30 text-[#B4F437] text-xs font-semibold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Live Form Responses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Form Responses & Submissions
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Real-time response database synchronized live with your connected Google Spreadsheet.
            </p>
          </div>

          {/* Action toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300 hover:text-white px-2.5 py-2 rounded-lg border border-white/10 bg-black/40">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-white/20 bg-black text-[#B4F437] focus:ring-[#B4F437] h-3.5 w-3.5"
              />
              <span>Auto-sync (20s)</span>
            </label>

            <button
              onClick={() => loadSheet(activeSheetUrl)}
              disabled={loading || !activeSheetUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-4 py-2 text-xs font-bold transition-all shadow-[0_0_20px_rgba(180,244,55,0.25)] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-300">Google Sheet Connection Notice</div>
              <p className="mt-0.5 text-neutral-300">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ============================================================= */}
        {/* STATS OVERVIEW CARDS                                          */}
        {/* ============================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#B4F437]">
              {loading && data.totalResponses === 0 ? (
                <span className="inline-block w-8 h-8 rounded bg-neutral-800 animate-pulse" />
              ) : (
                data.totalResponses
              )}
            </div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wider font-semibold">
              Total Submissions
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Live responses recorded
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {loading && data.headers.length === 0 ? (
                <span className="inline-block w-8 h-8 rounded bg-neutral-800 animate-pulse" />
              ) : (
                displayedHeaders.length
              )}
            </div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wider font-semibold">
              Visible Columns
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {displayedHeaders.length === data.headers.length
                ? `${data.headers.length} total fields`
                : `${displayedHeaders.length} of ${data.headers.length} fields`}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              100%
            </div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wider font-semibold">
              Sync Integrity
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Direct spreadsheet feed
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="text-base sm:text-lg font-bold text-[#B4F437] truncate mt-1">
              {data.lastUpdated || (loading ? 'Syncing...' : 'Ready')}
            </div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wider font-semibold">
              Last Verified
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {autoRefresh ? 'Auto-refresh active' : 'Live spreadsheet link'}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* TABS & SEARCH / FILTER TOOLBAR                                */}
        {/* ============================================================= */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-white/10 bg-black/40">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-[#B4F437] text-[#080C07] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Response Table ({filteredAndSortedRows.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#B4F437] text-[#080C07] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Question Insights ({analyticsData.length})</span>
            </button>
          </div>

          {/* Search, All Columns selector, Filter, Layout & Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial sm:min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  selectedColumnFilter === 'all'
                    ? 'Search all fields...'
                    : `Search in ${selectedColumnFilter}...`
                }
                className="w-full rounded-lg border border-white/15 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-[#B4F437] focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Column Search Scope Filter */}
            {data.headers.length > 0 && (
              <div className="relative">
                <select
                  value={selectedColumnFilter}
                  onChange={(e) => {
                    setSelectedColumnFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-neutral-200 focus:border-[#B4F437] focus:outline-none max-w-[140px] truncate cursor-pointer hover:border-[#B4F437]/50"
                  title="Choose which column to filter/search"
                >
                  <option value="all">Filter: All Columns</option>
                  {data.headers.map((h) => (
                    <option key={h} value={h}>
                      Filter: {h}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* WORKABLE "ALL COLUMNS" VISIBILITY BUTTON & DROPDOWN */}
            {data.headers.length > 0 && (
              <div className="relative" ref={columnDropdownRef}>
                <button
                  type="button"
                  id="all-columns-toggle-btn"
                  onClick={() => setShowColumnDropdown((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    visibleColumns.length === data.headers.length
                      ? 'border-white/15 bg-black/40 text-neutral-200 hover:border-[#B4F437]/60 hover:text-white'
                      : 'border-[#B4F437]/50 bg-[#B4F437]/15 text-[#B4F437] shadow-sm'
                  }`}
                  title="Toggle visible columns in table"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#B4F437]" />
                  <span>
                    {visibleColumns.length === data.headers.length
                      ? 'All Columns'
                      : `Columns (${visibleColumns.length}/${data.headers.length})`}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                      showColumnDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Column Visibility Popover Menu */}
                {showColumnDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/15 bg-[#0C120B] p-3 shadow-2xl z-40 backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Eye className="w-3.5 h-3.5 text-[#B4F437]" />
                        <span>Visible Columns ({visibleColumns.length})</span>
                      </div>
                      <button
                        type="button"
                        onClick={showAllColumns}
                        className="text-[11px] font-semibold text-[#B4F437] hover:underline"
                      >
                        Show All
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                      {data.headers.map((header) => {
                        const isVisible = visibleColumns.includes(header);
                        return (
                          <div
                            key={header}
                            className="group flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={() => toggleColumnVisibility(header)}
                                className="rounded border-white/20 bg-black text-[#B4F437] focus:ring-[#B4F437] h-3.5 w-3.5 cursor-pointer"
                              />
                              <span
                                className={`text-xs truncate ${
                                  isVisible ? 'text-neutral-100 font-medium' : 'text-neutral-500'
                                }`}
                                title={header}
                              >
                                {header}
                              </span>
                            </label>

                            <button
                              type="button"
                              onClick={() => hideOtherColumns(header)}
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-[#B4F437] hover:underline ml-1 px-1 transition-opacity"
                              title="Show only this column"
                            >
                              Only
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Click to toggle column display</span>
                      <button
                        type="button"
                        onClick={() => setShowColumnDropdown(false)}
                        className="text-white hover:text-[#B4F437] font-medium"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile layout toggle (cards vs table) */}
            <div className="inline-flex sm:hidden items-center rounded-lg border border-white/15 bg-black/40 p-0.5">
              <button
                onClick={() => setMobileLayout('table')}
                className={`p-1 rounded ${mobileLayout === 'table' ? 'bg-[#B4F437] text-black' : 'text-neutral-400'}`}
                title="Table view"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMobileLayout('cards')}
                className={`p-1 rounded ${mobileLayout === 'cards' ? 'bg-[#B4F437] text-black' : 'text-neutral-400'}`}
                title="Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={data.rows.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Download responses as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#B4F437]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Active sort and filter chips */}
        {(sortConfig || selectedColumnFilter !== 'all' || visibleColumns.length < data.headers.length) && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
            {sortConfig && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] border border-white/10 px-2 py-0.5 text-neutral-300">
                <span>Sorted by: <strong>{sortConfig.key}</strong> ({sortConfig.direction.toUpperCase()})</span>
                <button
                  onClick={() => setSortConfig(null)}
                  className="hover:text-white ml-0.5"
                  title="Clear sort"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedColumnFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#B4F437]/10 border border-[#B4F437]/20 px-2 py-0.5 text-[#B4F437]">
                <span>Searching in: <strong>{selectedColumnFilter}</strong></span>
                <button
                  onClick={() => setSelectedColumnFilter('all')}
                  className="hover:text-white ml-0.5"
                  title="Search all columns"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {visibleColumns.length < data.headers.length && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] border border-white/10 px-2 py-0.5 text-neutral-300">
                <span>{visibleColumns.length} of {data.headers.length} columns displayed</span>
                <button
                  onClick={showAllColumns}
                  className="hover:text-white text-[#B4F437] ml-1 underline"
                >
                  Reset all
                </button>
              </span>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* MAIN VIEW: TABLE OR ANALYTICS                                 */}
        {/* ============================================================= */}
        {loading && data.rows.length === 0 ? (
          /* Loading Skeleton */
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <RefreshCw className="w-8 h-8 text-[#B4F437] animate-spin mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Fetching Real Google Form Responses...
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Connecting to your Google Sheet feed. Your submissions will render here automatically.
            </p>
          </div>
        ) : data.rows.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <FileSpreadsheet className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {activeSheetUrl ? 'No Responses in Sheet' : 'No Google Sheet Configured'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-5 leading-relaxed">
              {activeSheetUrl
                ? 'Your connected spreadsheet appears to have no submissions yet, or is currently empty.'
                : 'Please add your Google Sheet link directly into src/lib/googleSheets.ts under PERMANENT_GOOGLE_SHEET_URL to display your live responses.'}
            </p>
            {activeSheetUrl ? (
              <button
                onClick={() => loadSheet(activeSheetUrl)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#B4F437] text-[#080C07] px-5 py-2.5 text-xs font-bold"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sync Now</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 font-mono text-xs text-[#B4F437]">
                <Code2 className="w-3.5 h-3.5" />
                <span>src/lib/googleSheets.ts ➔ PERMANENT_GOOGLE_SHEET_URL</span>
              </div>
            )}
          </div>
        ) : activeTab === 'table' ? (
          /* =========================================================== */
          /* DATA TABLE                                                  */
          /* =========================================================== */
          <div>
            <div className={`${mobileLayout === 'cards' ? 'hidden sm:block' : 'block'} rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden`}>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0C120B] text-neutral-300 uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-3.5 w-12 text-center text-neutral-500 sticky left-0 bg-[#0C120B] z-10">
                        #
                      </th>
                      {displayedHeaders.map((header) => (
                        <th
                          key={header}
                          onClick={() => handleSort(header)}
                          className="py-3.5 px-4 text-white font-bold whitespace-nowrap min-w-[160px] max-w-[280px] cursor-pointer hover:bg-white/[0.05] transition-colors select-none group"
                          title={`Click to sort by ${header}`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="truncate">{header}</span>
                            <span className="text-neutral-500 group-hover:text-[#B4F437] transition-colors shrink-0">
                              {sortConfig?.key === header ? (
                                sortConfig.direction === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-[#B4F437]" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-[#B4F437]" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={displayedHeaders.length + 1}
                          className="py-12 text-center text-neutral-400"
                        >
                          <FileSpreadsheet className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                          <div>No responses match your search filter "{searchTerm}"</div>
                          <button
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-xs text-[#B4F437] hover:underline"
                          >
                            Clear search query
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row, rIdx) => {
                        const absoluteIndex = (currentPage - 1) * rowsPerPage + rIdx + 1;
                        return (
                          <tr
                            key={rIdx}
                            className="hover:bg-white/[0.04] transition-colors group"
                          >
                            <td className="py-3 px-3.5 text-center text-neutral-500 font-mono text-[11px] sticky left-0 bg-[#080C07] group-hover:bg-[#111710] transition-colors border-r border-white/5">
                              {absoluteIndex}
                            </td>
                            {displayedHeaders.map((header) => {
                              const val = row[header] || '—';
                              const isTimestamp =
                                header.toLowerCase().includes('time') ||
                                header.toLowerCase().includes('date');
                              return (
                                <td
                                  key={header}
                                  className={`py-3 px-4 text-neutral-200 leading-relaxed max-w-[320px] break-words ${
                                    isTimestamp ? 'font-mono text-[11px] text-[#B4F437] whitespace-nowrap' : ''
                                  }`}
                                >
                                  {val}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className={`${mobileLayout === 'cards' ? 'block sm:hidden' : 'hidden'} space-y-3`}>
              {paginatedRows.map((row, rIdx) => {
                const absoluteIndex = (currentPage - 1) * rowsPerPage + rIdx + 1;
                return (
                  <div
                    key={rIdx}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-neutral-400 font-mono">
                      <span>Response #{absoluteIndex}</span>
                      {row['Timestamp'] && (
                        <span className="text-[#B4F437]">{row['Timestamp']}</span>
                      )}
                    </div>
                    {displayedHeaders
                      .filter((h) => !h.toLowerCase().includes('timestamp'))
                      .map((header) => (
                        <div key={header} className="text-xs">
                          <div className="text-neutral-400 font-medium mb-0.5">{header}</div>
                          <div className="text-white break-words">{row[header] || '—'}</div>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span>
                  Showing {filteredAndSortedRows.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                  {Math.min(currentPage * rowsPerPage, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} responses
                </span>
                <span className="text-neutral-600">|</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-white/10 bg-neutral-900 px-2 py-0.5 text-xs text-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-neutral-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================== */
          /* QUESTION INSIGHTS                                           */
          /* =========================================================== */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-white/10">
              <span>Showing insights for {analyticsData.length} questions / columns</span>
              {visibleColumns.length < data.headers.length && (
                <button
                  onClick={showAllColumns}
                  className="text-[#B4F437] hover:underline"
                >
                  Show all questions
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {analyticsData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-[#B4F437] uppercase tracking-wider">
                        Question #{idx + 1}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {item.total} responses
                      </span>
                    </div>

                    <h3
                      className="text-sm sm:text-base font-bold text-white mb-4 line-clamp-2"
                      title={item.header}
                    >
                      {item.header}
                    </h3>

                    <div className="space-y-3">
                      {item.entries.slice(0, 6).map(([label, count]) => {
                        const percent = Math.round((count / item.total) * 100);
                        const isTop = label === item.topAnswer;
                        return (
                          <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs gap-2">
                              <span
                                className={`truncate max-w-[70%] font-medium ${
                                  isTop ? 'text-[#B4F437]' : 'text-neutral-200'
                                }`}
                                title={label}
                              >
                                {label}
                              </span>
                              <span className="text-neutral-400 shrink-0 font-mono text-[11px]">
                                {count} ({percent}%)
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isTop ? 'bg-[#B4F437]' : 'bg-emerald-400/80'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {item.entries.length > 0 && (
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Top Answer:</span>
                      <span className="text-white font-semibold truncate max-w-[60%] text-right">
                        {item.topAnswer}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
