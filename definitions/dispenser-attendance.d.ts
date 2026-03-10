export interface IDispenserAttendanceRecord {
  id?: string;
  dispenserId: Types.ObjectId | string;
  userId: Types.ObjectId | string; // User account of attendant
  attendantId: Types.ObjectId | string; // Staff record ID
  attendantName: string; // Populated from attendantId

  // Shift readings
  openingBalanceLitres: number;
  closingBalanceLitres?: number;

  // Shift summary
  totalDispensed?: number;
  expectedClosing?: number;
  variance?: number;

  // Timestamps
  loginTime: Date;
  logoutTime?: Date;

  // Status
  status: "active" | "completed" | "reconciled";
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}
