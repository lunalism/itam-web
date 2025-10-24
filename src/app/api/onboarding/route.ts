import { NextResponse } from "next/server";

export async function GET(){
  const seed = [
    { id: "U-24001", name: "Kim Hana", email: "hana.kim@example.com", team: "R&D", role: "Engineer", startDate: "2025-11-01", status: "pending" },
    { id: "U-24002", name: "Lee Min", email: "min.lee@example.com", team: "IT", role: "SysAdmin", startDate: "2025-11-04", status: "in-progress" },
    { id: "U-24003", name: "Sato Yui", email: "yui.sato@example.com", team: "Operations", role: "Coordinator", startDate: "2025-11-05", status: "completed" }
  ];
  return NextResponse.json({ users: seed });
}
