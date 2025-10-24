'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Request } from "@/types/itam";

export default function RequestsPage(){
  const [rows, setRows] = useState<Request[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(()=>{
    (async()=>{
      const res = await fetch("/api/requests");
      const json = await res.json();
      setRows(json.requests);
    })();
  },[]);

  const filtered = useMemo(()=>{
    const qq = q.toLowerCase();
    return rows.filter(r => {
      const matchQ = qq ? (r.id + r.type + r.requesterId).toLowerCase().includes(qq) : true;
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
  }, [rows, q, status]);

  function renderStatus(s: Request["status"]) {
    if(s === "open") return <Badge>Open</Badge>;
    if(s === "approved") return <Badge variant="success">Approved</Badge>;
    if(s === "rejected") return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="info">Fulfilled</Badge>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search id/type/requester..." value={q} onChange={e=>setQ(e.target.value)} className="max-w-sm" />
          <select className="h-10 rounded-xl border px-3" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="all">All status</option>
            <option value="open">Open</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>

        <Table>
          <THead><TR><TH>ID</TH><TH>Type</TH><TH>Status</TH><TH>Requester</TH><TH>Created</TH></TR></THead>
          <TBody>
            {filtered.map(r => (
              <TR key={r.id}>
                <TD className="font-mono">{r.id}</TD>
                <TD className="capitalize">{r.type}</TD>
                <TD>{renderStatus(r.status)}</TD>
                <TD>{r.requesterId}</TD>
                <TD>{new Date(r.createdAt).toLocaleString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
