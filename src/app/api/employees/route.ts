import { NextResponse } from "next/server";

export async function GET(){
  const employees = [
    { id: "EMP-1001", name: "Alice Kim", email: "alice.kim@corp.local", team: "R&D", role: "Engineer", location: "Seoul" },
    { id: "EMP-1002", name: "Minjae Lee", email: "minjae.lee@corp.local", team: "IT", role: "SysAdmin", location: "Seoul" },
    { id: "EMP-1003", name: "Sara Park", email: "sara.park@corp.local", team: "Operations", role: "Coordinator", location: "Magny-Cours" },
    { id: "EMP-1004", name: "Yui Sato", email: "yui.sato@corp.local", team: "Finance", role: "Analyst", location: "Tokyo" }
  ];
  return NextResponse.json({ employees });
}
