// src/lib/csv.ts
// Minimal RFC4180-ish CSV parse + stringify

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        cell += '"';
        i++;
        continue;
      }
      if (c === '"') {
        inQuotes = false;
        continue;
      }
      cell += c;
      continue;
    }

    if (c === '"') { inQuotes = true; continue; }
    if (c === ",") { row.push(cell); cell = ""; continue; }
    if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; continue; }
    if (c === "\r") { continue; } // ignore CR (Windows line endings)

    cell += c;
  }

  // push last cell/row
  row.push(cell);
  rows.push(row);

  // drop trailing empty row if any
  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    rows.pop();
  }
  return rows;
}

export function toCSV(headers: string[], data: Record<string, any>[]): string {
  const esc = (v: any) => {
    const s = (v ?? "").toString();
    // Quote if contains quote/comma/newline; double any internal quotes
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const head = headers.join(",");
  const body = data.map(r => headers.map(h => esc(r[h])).join(",")).join("\n");
  return body ? `${head}\n${body}` : head;
}
