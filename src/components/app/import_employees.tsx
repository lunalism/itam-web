'use client';

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/lib/csv";
import type { Employee } from "@/types/itam";

const REQ_HEADERS = ["id","name","email","team","role","phone","location"] as const;

function normalizeRow(row: string[]): Employee | null {
  if (row.length < REQ_HEADERS.length) return null;
  const [id,name,email,team,role,phone,location] = row.map(c => c?.trim?.() ?? "");
  if (!id || !name || !email) return null;
  return { id, name, email, team, role, phone, location };
}

export default function ImportEmployees({ open, onClose, onImport }: {
  open: boolean;
  onClose: () => void;
  onImport: (rows: Employee[], mode: "append" | "replace") => void;
}){
  const [fileName, setFileName] = React.useState<string>("");
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState<"append" | "replace">("append");

  function downloadTemplate(){
    const sample = [
      ["EMP-2001","Jisoo Han","jisoo.han@corp.local","R&D","Engineer","+82-10-1234-5678","Seoul"],
      ["EMP-2002","Pierre Martin","pierre.martin@corp.local","IT","Administrator","+33-6-00-00-00-00","Magny-Cours"]
    ];
    const csv = [REQ_HEADERS.join(","), ...sample.map(r=>r.map(x=>`"${x.replaceAll('"','""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const text = await f.text();
    const grid = parseCSV(text);
    if (grid.length === 0) { setErrors(["Empty CSV"]); setRows([]); return; }

    // Validate headers (case-insensitive)
    const headers = grid[0].map(h => h.trim().toLowerCase());
    const ok = REQ_HEADERS.every(h => headers.includes(h));
    if (!ok) {
      setErrors([`CSV header must include: ${REQ_HEADERS.join(", ")}`]);
      setRows([]);
      return;
    }

    const indices = REQ_HEADERS.map(h => headers.indexOf(h));
    const data: Employee[] = [];
    const errs: string[] = [];
    for (let i=1; i<grid.length; i++){
      const row = grid[i];
      const picked = indices.map(idx => row[idx] ?? "");
      const emp = normalizeRow(picked);
      if (!emp) { errs.push(`Row ${i+1}: invalid or missing required fields`); continue; }
      data.push(emp);
    }
    setRows(data);
    setErrors(errs);
  }

  function confirmImport(){
    if (rows.length === 0) { alert("No valid rows to import."); return; }
    onImport(rows, mode);
    setRows([]);
    setErrors([]);
    setFileName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Import employees (CSV)">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input type="file" accept=".csv,text/csv" onChange={handleFile} />
          <Button variant="outline" onClick={downloadTemplate}>Download CSV Template</Button>
        </div>
        {fileName && <div className="text-sm text-gray-500">Selected: {fileName}</div>}
        <div className="flex items-center gap-3">
          <label className="text-sm">Mode:</label>
          <select className="h-10 rounded-xl border px-3" value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="append">Append (skip duplicate IDs)</option>
            <option value="replace">Replace all</option>
          </select>
        </div>
        <div className="text-sm">
          Valid rows: <b>{rows.length}</b>{errors.length ? ` — Errors: ${errors.length}` : ""}
        </div>
        {!!errors.length && (
          <details className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            <summary className="cursor-pointer">Show errors</summary>
            <ul className="list-disc pl-5 mt-2">{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
          </details>
        )}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={confirmImport}>Import</Button>
        </div>
      </div>
    </Modal>
  );
}
