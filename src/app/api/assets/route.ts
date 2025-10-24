import { NextResponse } from "next/server";

const types = ["laptop","phone","tablet","server"] as const;
const statuses = ["active","repair","retired"] as const;

function seed(count = 24){
  const arr = [];
  for(let i=0;i<count;i++){
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    arr.push({
      id: `AS-${(1000+i).toString().padStart(4,"0")}`,
      type,
      model: `${type.toUpperCase()}-MODEL-${(i%5)+1}`,
      serial: `SN${(Math.random()*1e7|0).toString(36).toUpperCase()}`,
      status,
      updatedAt: new Date(Date.now() - i*86400000).toISOString()
    });
  }
  return arr;
}

export async function GET(){
  return NextResponse.json({ assets: seed() });
}
