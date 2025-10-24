'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/types/itam";

export default function AssetsPage(){
  const [rows, setRows] = useState<Asset[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(()=>{
    (async()=>{
      const res = await fetch("/api/assets");
      const json = await res.json();
      setRows(json.assets);
    })();
  },[]);

  const filtered = useMemo(()=>{
    const qq = q.toLowerCase();
    return rows.filter(r => {
      const matchQ = qq ? (r.id + r.model + r.serial).toLowerCase().includes(qq) : true;
      const matchT = type === "all" || r.type === type;
      const matchS = status === "all" || r.status === status;
      return matchQ && matchT && matchS;
    });
  }, [rows, q, type, status]);

  function renderStatus(s: Asset["status"]){
    if(s === "active") return <Badge variant="success">Active</Badge>;
    if(s === "repair") return <Badge variant="warning">In repair</Badge>;
    return <Badge variant="destructive">Retired</Badge>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Assets</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search id/model/serial..." value={q} onChange={e=>setQ(e.target.value)} className="max-w-sm" />
          <select className="h-10 rounded-xl border px-3" value={type} onChange={e=>setType(e.target.value)}>
            <option value="all">All types</option>
            <option value="laptop">Laptop</option>
            <option value="phone">Phone</option>
            <option value="tablet">Tablet</option>
            <option value="server">Server</option>
          </select>
          <select className="h-10 rounded-xl border px-3" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="repair">In repair</option>
            <option value="retired">Retired</option>
          </select>
          <Button variant="outline" onClick={()=>{ setQ(""); setType("all"); setStatus("all"); }}>Reset</Button>
        </div>

        <Table>
          <THead><TR><TH>ID</TH><TH>Type</TH><TH>Model</TH><TH>Serial</TH><TH>Status</TH><TH>Updated</TH></TR></THead>
          <TBody>
            {filtered.map(r => (
              <TR key={r.id}>
                <TD className="font-mono">{r.id}</TD>
                <TD className="capitalize">{r.type}</TD>
                <TD>{r.model}</TD>
                <TD className="font-mono">{r.serial}</TD>
                <TD>{renderStatus(r.status)}</TD>
                <TD>{new Date(r.updatedAt).toLocaleDateString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  )
}
