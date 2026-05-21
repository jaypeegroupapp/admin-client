import { Types } from "mongoose";

export interface ITankerDispenser {
  id?: string;
  tankerId: Types.ObjectId | string;
  dispenserId: Types.ObjectId | string;
  isActive: boolean;
  connectedAt?: Date;
  disconnectedAt?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export type ConnectDispenserFormState = {
  errors: {
    dispenserId?: string[];
    global?: string[];
  };
  message: string;
};
