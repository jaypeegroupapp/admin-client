// definitions/staff.ts
import { IMine } from "./mine";

export interface IStaff {
  id?: string;
  name: string;
  status: "active" | "inactive";
  userId: string;
  mines: IMine[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}
