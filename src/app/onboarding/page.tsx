'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { load, save } from "@/lib/storage";

type Status = "pending" | "in-progress" | "completed";
type NewUser = {
  id: string;
  name: string;
  email: string;
  team: string;
  role: string;
  startDate: string;
  status: Status;
};
const LS_KEY = "itam_onboarding_users_v1";

export default function OnboardingPage(){
  const [users, setUsers] = useState<NewUser[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [open, setOpen] = useState(false);

  // Form states
  const [form, setForm] = useState<NewUser>({ id: "", name: "", email: "", team: "", role: "", startDate: "", status: "pending" });

  useEffect(()=>{
    const cached = load<NewUser[]>(LS_KEY, []);
    if(cached.length){
      setUsers(cached);
      return;
    }
    (async () => {
      const res = await fetch("/api/onboarding");
      const json = await res.json();
      setUsers(json.users);
      save(LS_KEY, json.users);
    })();
  }, []);

  useEffect(()=>{ save(LS_KEY, users); }, [users]);

  const filtered = useMemo(()=>{
    return users.filter(u=>{
      const qq = q.toLowerCase();
      const matchesQ = qq ? (u.id + u.name + u.email + u.team + u.role).toLowerCase().includes(qq) : true;
      const matchesS = status === "all" ? true : u.status === status;
      return matchesQ && matchesS;
    });
  }, [users, q, status]);

  function statusBadge(s: Status){
    if(s === "completed") return <Badge variant="success">Completed</Badge>;
    if(s === "in-progress") return <Badge variant="warning">In progress</Badge>;
    return <Badge>Pending</Badge>;
  }

  function addUser(){
    if(!form.id || !form.name) return;
    setUsers(prev => [...prev, form]);
    setForm({ id: "", name: "", email: "", team: "", role: "", startDate: "", status: "pending" });
    setOpen(false);
  }

  function remove(id: string){
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  function exportCSV(){
    const header = ["id","name","email","team","role","startDate","status"];
    const rows = filtered.map(u => [u.id, u.name, u.email, u.team, u.role, u.startDate, u.status]);
    const csv = [header, ...rows].map(r => r.map(v => `"${(v||'').toString().replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Onboarding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search id/name/email/team/role..." className="max-w-sm" value={q} onChange={e=>setQ(e.target.value)} />
            <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="h-10 rounded-xl border px-3">
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <Button onClick={()=>setOpen(true)}>Add</Button>
            <Button variant="outline" onClick={()=>{ setQ(""); setStatus("all"); }}>Reset</Button>
            <Button variant="ghost" onClick={exportCSV}>Export CSV</Button>
          </div>

          <Table>
            <THead>
              <TR>
                <TH>ID</TH><TH>Name</TH><TH>Email</TH><TH>Team</TH><TH>Role</TH><TH>Start</TH><TH>Status</TH><TH></TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map(u => (
                <TR key={u.id}>
                  <TD className="font-mono">{u.id}</TD>
                  <TD>{u.name}</TD>
                  <TD>{u.email}</TD>
                  <TD>{u.team}</TD>
                  <TD>{u.role}</TD>
                  <TD>{u.startDate}</TD>
                  <TD>{statusBadge(u.status)}</TD>
                  <TD className="text-right">
                    <button className="text-red-600 hover:underline" onClick={()=>remove(u.id)}>Delete</button>
                  </TD>
                </TR>
              ))}
              {filtered.length === 0 && <TR><TD colSpan={8} className="text-center py-6 text-gray-500">No records</TD></TR>}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title="Add new member">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="ID (e.g., U-24004)" value={form.id} onChange={e=>setForm({...form, id: e.target.value})} />
            <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
            <Input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
            <Input placeholder="Team" value={form.team} onChange={e=>setForm({...form, team: e.target.value})} />
            <Input placeholder="Role" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} />
            <Input type="date" placeholder="Start date" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} />
            <select value={form.status} onChange={e=>setForm({...form, status: e.target.value as Status})} className="h-10 rounded-xl border px-3">
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={addUser}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
