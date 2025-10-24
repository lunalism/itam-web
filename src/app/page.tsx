'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Asset = {
  id: string;
  name: string;
  owner: string;
  type: string;
  status: "active" | "repair" | "retired";
  updatedAt: string;
};

export default function Dashboard() {
  const [data, setData] = useState<Asset[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/assets");
      const json = await res.json();
      setData(json.assets as Asset[]);
    })();
  }, []);

  const filtered = useMemo(() => {
    return data.filter(a => {
      const matchQ = q ? (a.name + a.owner + a.id).toLowerCase().includes(q.toLowerCase()) : true;
      const matchType = type === "all" ? true : a.type === type;
      const matchStatus = status === "all" ? true : a.status === status;
      return matchQ && matchType && matchStatus;
    });
  }, [data, q, type, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search id/name/owner..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
            <select value={type} onChange={(e)=>setType(e.target.value)} className="h-10 rounded-xl border px-3">
              <option value="all">All types</option>
              <option value="laptop">Laptop</option>
              <option value="phone">Phone</option>
              <option value="tablet">Tablet</option>
              <option value="server">Server</option>
            </select>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="h-10 rounded-xl border px-3">
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="repair">In repair</option>
              <option value="retired">Retired</option>
            </select>
            <Button variant="outline" onClick={()=>{ setQ(""); setType("all"); setStatus("all"); }}>Reset</Button>
          </div>

          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Name</TH>
                <TH>Owner</TH>
                <TH>Type</TH>
                <TH>Status</TH>
                <TH>Updated</TH>
              </TR>
            </THead>
            <TBody>
              {pageData.map(a => (
                <TR key={a.id}>
                  <TD className="font-mono">{a.id}</TD>
                  <TD>{a.name}</TD>
                  <TD>{a.owner}</TD>
                  <TD className="capitalize">{a.type}</TD>
                  <TD className="capitalize">{a.status}</TD>
                  <TD>{new Date(a.updatedAt).toLocaleDateString()}</TD>
                </TR>
              ))}
              {pageData.length === 0 && (
                <TR><TD colSpan={6} className="text-center py-6 text-gray-500">No results</TD></TR>
              )}
            </TBody>
          </Table>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total: {filtered.length}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</Button>
              <div className="text-sm">Page {page} / {totalPages}</div>
              <Button variant="outline" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
