'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import ImportEmployees from "@/components/app/import_employees";
import type { Employee } from "@/types/itam";
import { load, save } from "@/lib/storage";

const LS_KEY = "itam_employees_v1";

const empty: Employee = { id: "", name: "", email: "", team: "", role: "", phone: "", location: "" };

export default function EmployeesPage(){
  const [rows, setRows] = useState<Employee[]>([]);
  const [q, setQ] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [form, setForm] = useState<Employee>({ ...empty });

  // hydrate
  useEffect(()=>{
    const cached = load<Employee[]>(LS_KEY, []);
    if (cached.length) { setRows(cached); return; }
    (async()=>{
      const res = await fetch("/api/employees");
      const json = await res.json();
      setRows(json.employees as Employee[]);
      save(LS_KEY, json.employees as Employee[]);
    })();
  },[]);

  useEffect(()=>{ save(LS_KEY, rows) }, [rows]);

  const filtered = useMemo(()=>{
    const qq = q.toLowerCase();
    return rows.filter(r => !q || (r.id + r.name + r.email + r.team + r.role + (r.location||"") + (r.phone||"")).toLowerCase().includes(qq));
  }, [rows, q]);

  function addEmployee(){
    if(!form.id || !form.name || !form.email){ alert("id, name, email 은 필수입니다."); return; }
    if(rows.some(r => r.id === form.id)){ alert("이미 존재하는 ID 입니다."); return; }
    setRows(prev => [...prev, form]);
    setForm({ ...empty });
    setOpenAdd(false);
  }

  function onImport(imported: Employee[], mode: "append" | "replace"){
    if (mode === "replace") {
      setRows(imported);
      return;
    }
    // append mode: skip duplicate IDs
    const setIds = new Set(rows.map(r=>r.id));
    const merged = [...rows];
    for (const r of imported) {
      if (setIds.has(r.id)) continue;
      merged.push(r);
      setIds.add(r.id);
    }
    setRows(merged);
  }

  function remove(id: string){
    if(!confirm("정말 삭제할까요?")) return;
    setRows(prev => prev.filter(r => r.id !== id));
  }

  function exportCSV(){
    const header = ["id","name","email","team","role","phone","location"];
    const body = filtered.map(r => [r.id, r.name, r.email, r.team, r.role, r.phone || "", r.location || ""]);
    const csv = [header, ...body].map(row => row.map(cell => `"${(cell||'').toString().replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader><CardTitle>Employees</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search id/name/email/team/role..." value={q} onChange={e=>setQ(e.target.value)} className="max-w-sm" />
          <Button onClick={()=>setOpenAdd(true)}>Add</Button>
          <Button onClick={()=>setOpenImport(true)}>Import CSV</Button>
          <Button variant="ghost" onClick={exportCSV}>Export CSV</Button>
        </div>

        <Table>
          <THead>
            <TR><TH>ID</TH><TH>Name</TH><TH>Email</TH><TH>Team</TH><TH>Role</TH><TH>Phone</TH><TH>Location</TH><TH></TH></TR>
          </THead>
          <TBody>
            {filtered.map(r => (
              <TR key={r.id}>
                <TD className="font-mono">{r.id}</TD>
                <TD>{r.name}</TD>
                <TD>{r.email}</TD>
                <TD>{r.team}</TD>
                <TD>{r.role}</TD>
                <TD>{r.phone || "-"}</TD>
                <TD>{r.location || "-"}</TD>
                <TD className="text-right">
                  <button className="text-red-600 hover:underline" onClick={()=>remove(r.id)}>Delete</button>
                </TD>
              </TR>
            ))}
            {filtered.length === 0 && <TR><TD colSpan={8} className="text-center py-6 text-gray-500">No records</TD></TR>}
          </TBody>
        </Table>
      </CardContent>

      {/* Add Modal */}
      <Modal open={openAdd} onClose={()=>setOpenAdd(false)} title="Add employee">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="ID (e.g., EMP-1005)" value={form.id} onChange={e=>setForm({...form, id: e.target.value})} />
          <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <Input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
          <Input placeholder="Team" value={form.team} onChange={e=>setForm({...form, team: e.target.value})} />
          <Input placeholder="Role" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} />
          <Input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
          <Input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} />
        </div>
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button variant="outline" onClick={()=>setOpenAdd(false)}>Cancel</Button>
          <Button onClick={addEmployee}>Add</Button>
        </div>
      </Modal>

      {/* Import Modal */}
      <ImportEmployees open={openImport} onClose={()=>setOpenImport(false)} onImport={onImport} />
    </Card>
  );
}
