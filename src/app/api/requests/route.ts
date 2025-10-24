import { NextResponse } from "next/server";

const statuses = ["open","approved","rejected","fulfilled"] as const;

function seed(count = 16){
  const arr = [];
  for(let i=0;i<count;i++){
    const status = statuses[i % statuses.length];
    const type = (["device","license","access"] as const)[i % 3];
    arr.push({
      id: `RQ-${(3000+i).toString().padStart(4,"0")}`,
      type,
      requesterId: `EMP-10${(i%4)+1}`,
      payload: {},
      status,
      createdAt: new Date(Date.now() - i*3600_000).toISOString(),
    });
  }
  return arr;
}

export async function GET(){
  return NextResponse.json({ requests: seed() });
}
