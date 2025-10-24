import { NextResponse } from "next/server";

const types = ["Teams Calling Plan","M365 E3","M365 E5","Adobe CC","Other"] as const;

function seed(count = 20){
  const arr = [];
  for(let i=0;i<count;i++){
    const type = types[i % types.length];
    const assigned = i % 2 === 0;
    arr.push({
      id: `LC-${(1200+i).toString().padStart(4,"0")}`,
      type,
      status: assigned ? "assigned" : "unassigned",
      assigneeId: assigned ? `EMP-10${(i%4)+1}` : undefined,
      note: type === "Teams Calling Plan" ? "Voice-ready" : undefined,
    });
  }
  return arr;
}

export async function GET(){
  return NextResponse.json({ licenses: seed() });
}
