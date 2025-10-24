'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { License } from "@/types/itam";

export default function LicensesPage(){
  const [rows, setRows] = useState<License[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(()=>{
    (async()=>{
      const res = await fetch("/api/licenses");
      const json = await res.json();
      setRows(json.licenses);
    })();
  },[]);

  const filtered = useMemo(()=>{
    const qq = q.toLowerCase();
    return rows.filter(r => {
      const matchQ = qq ? (r.id + r.type + (r.note || "")).toLowerCase().includes(qq) : true;
      const matchT = type === "all" || r.type === type;
      const matchS = status === "all" || r.status === status;
      return matchQ && matchT && matchS;
    });
  }, [rows, q, type, status]);

  function renderStatus(s: License["status"]) {
    return s === "assigned" ? <Badge variant="info">Assigned</Badge> : <Badge>Unassigned</Badge>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Licenses</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search id/type/note..." value={q} onChange={e=>setQ(e.target.value)} className="max-w-sm" />
          <select className="h-10 rounded-xl border px-3" value={type} onChange={e=>setType(e.target.value)}>
            <option value="all">All types</option>
            <option>Teams Calling Plan</option>
            <option>M365 E3</option>
            <option>M365 E5</option>
            <option>Adobe CC</option>
            <option>Other</option>
          </select>
          <select className="h-10 rounded-xl border px-3" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="all">All status</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        <Table>
          <THead><TR><TH>ID</TH><TH>Type</TH><TH>Status</TH><TH>Assignee</TH><TH>Note</TH></TR></THead>
          <TBody>
            {filtered.map(r => (
              <TR key={r.id}>
                <TD className="font-mono">{r.id}</TD>
                <TD>{r.type}</TD>
                <TD>{renderStatus(r.status)}</TD>
                <TD>{r.assigneeId || "-"}</TD>
                <TD>{r.note || "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
