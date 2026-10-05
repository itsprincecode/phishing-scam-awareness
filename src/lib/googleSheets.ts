// Utility for connecting and parsing Google Form responses from Google Sheets

/**
 * ============================================================================
 * 🔗 PASTE YOUR GOOGLE SHEET LINK HERE
 * ============================================================================
 * Put your Google Sheet published CSV link, Google Sheet URL, or Sheet ID
 * between the quotes below. When set, the website will automatically load
 * your real-time responses from this sheet on every visit.
 *
 * Example:
 * export const PERMANENT_GOOGLE_SHEET_URL: string =
 *   'https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?output=csv';
 */
export const PERMANENT_GOOGLE_SHEET_URL: string =
  (import.meta.env.VITE_GOOGLE_SHEET_URL as string) || '';

export interface SheetResponseData {
  headers: string[];
  rows: Record<string, string>[];
  totalResponses: number;
  lastUpdated: string;
  sourceType: 'live';
  sheetTitle?: string;
  sourceUrl?: string;
}

/**
 * Empty initial state for responses.
 * Never displays dummy or sample data.
 */
export const EMPTY_SHEET_DATA: SheetResponseData = {
  headers: [],
  rows: [],
  totalResponses: 0,
  lastUpdated: '',
  sourceType: 'live',
};

export const LOCAL_STORAGE_SHEET_KEY = 'cyberaware_google_sheet_url';

/**
 * Returns the active sheet URL from PERMANENT_GOOGLE_SHEET_URL or localStorage
 */
export function getSavedSheetUrl(): string {
  if (PERMANENT_GOOGLE_SHEET_URL && PERMANENT_GOOGLE_SHEET_URL.trim().length > 0) {
    return PERMANENT_GOOGLE_SHEET_URL.trim();
  }
  return (localStorage.getItem(LOCAL_STORAGE_SHEET_KEY) || '').trim();
}

/**
 * Saves permanent URL to localStorage
 */
export function saveSheetUrl(url: string): void {
  localStorage.setItem(LOCAL_STORAGE_SHEET_KEY, url.trim());
}

/**
 * Standard RFC 4180 compliant CSV parser
 * Handles commas inside quotes, escaped quotes (""), and multiline values
 */
export function parseCSV(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // skip next quote
        } else {
          // End of quote
          insideQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = '';
      } else if (char === '\r') {
        // Ignore carriage return
      } else if (char === '\n') {
        row.push(current.trim());
        if (row.length > 0 && row.some((cell) => cell.length > 0)) {
          result.push(row);
        }
        row = [];
        current = '';
      } else {
        current += char;
      }
    }
  }

  // Push last field & row if pending
  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell.length > 0)) {
      result.push(row);
    }
  }

  if (result.length === 0) {
    return { headers: [], rows: [] };
  }

  // First row is headers
  const rawHeaders = result[0].map((h, idx) => (h && h.length > 0 ? h : `Column ${idx + 1}`));

  // Deduplicate headers if needed
  const headerCount: Record<string, number> = {};
  const headers = rawHeaders.map((h) => {
    if (headerCount[h]) {
      headerCount[h]++;
      return `${h} (${headerCount[h]})`;
    }
    headerCount[h] = 1;
    return h;
  });

  const rows = result.slice(1).map((r) => {
    const item: Record<string, string> = {};
    headers.forEach((header, index) => {
      item[header] = r[index] || '';
    });
    return item;
  });

  return { headers, rows };
}

/**
 * Normalizes user-entered Google Sheet URL or ID into workable CSV export URL endpoints
 */
export function normalizeSheetUrls(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const candidates: string[] = [];

  // Case 1: Published URL (starts with https://docs.google.com/spreadsheets/d/e/2PACX-...)
  if (trimmed.includes('/d/e/2PACX-')) {
    if (trimmed.includes('pub?output=csv') || trimmed.includes('&output=csv')) {
      candidates.push(trimmed);
    } else if (trimmed.includes('/pubhtml') || trimmed.includes('/pub')) {
      const base = trimmed.split('?')[0].replace('/pubhtml', '/pub');
      candidates.push(`${base}?output=csv`);
      candidates.push(`${base}?gid=0&single=true&output=csv`);
    } else {
      candidates.push(`${trimmed}&output=csv`);
    }
  }

  // Case 2: Regular Spreadsheet URL with ID (e.g. /spreadsheets/d/{ID}/...)
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    candidates.push(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`);
    candidates.push(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`);
  }

  // Case 3: Raw Sheet ID
  if (/^[a-zA-Z0-9-_]{20,60}$/.test(trimmed)) {
    candidates.push(`https://docs.google.com/spreadsheets/d/${trimmed}/gviz/tq?tqx=out:csv`);
    candidates.push(`https://docs.google.com/spreadsheets/d/${trimmed}/export?format=csv`);
  }

  // Case 4: Any other CSV URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (!candidates.includes(trimmed)) {
      candidates.push(trimmed);
    }
  }

  return candidates;
}

/**
 * Fetches and parses responses from Google Sheets
 */
export async function fetchGoogleSheetData(sheetUrlOrId: string): Promise<SheetResponseData> {
  const candidateUrls = normalizeSheetUrls(sheetUrlOrId);

  if (candidateUrls.length === 0) {
    throw new Error('Please provide a valid Google Sheet published CSV URL or sharing link.');
  }

  let lastError: Error | null = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/csv, text/plain, */*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const csvText = await response.text();

      // Check if it's HTML login redirect instead of CSV
      if (
        csvText.includes('<!DOCTYPE html>') ||
        csvText.includes('<html') ||
        csvText.includes('accounts.google.com')
      ) {
        throw new Error(
          'Google Sheet requires public permissions. In your Google Sheet, click File > Share > Publish to the web, or set sharing to "Anyone with the link can view".'
        );
      }

      const { headers, rows } = parseCSV(csvText);

      if (headers.length === 0) {
        throw new Error('The connected sheet contains no readable columns or data.');
      }

      return {
        headers,
        rows,
        totalResponses: rows.length,
        lastUpdated: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        sourceType: 'live',
        sourceUrl: url,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error('Failed to fetch data from the provided Google Sheet link.');
}
