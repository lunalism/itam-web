export type DeviceType = "laptop" | "phone" | "tablet" | "server";
export type AssetStatus = "active" | "repair" | "retired";
export type OnboardStatus = "pending" | "in-progress" | "completed";

export type Employee = {
  id: string;
  name: string;
  email: string;
  team: string;
  role: string;
  phone?: string;
  location?: string;
};

export type Asset = {
  id: string;        // AS-XXXX
  type: DeviceType;
  model: string;
  ownerId?: string;  // Employee.id
  status: AssetStatus;
  serial: string;
  updatedAt: string;
};

export type License = {
  id: string;        // LC-XXXX
  type: "Teams Calling Plan" | "M365 E3" | "M365 E5" | "Adobe CC" | "Other";
  assigneeId?: string; // Employee.id
  status: "assigned" | "unassigned";
  note?: string;
};

export type Trip = {
  id: string;          // TP-XXXX
  employeeId: string;  // Employee.id
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
};

export type Request = {
  id: string;          // RQ-XXXX
  type: "device" | "license" | "access";
  requesterId: string; // Employee.id
  payload: any;
  status: "open" | "approved" | "rejected" | "fulfilled";
  createdAt: string;
};
