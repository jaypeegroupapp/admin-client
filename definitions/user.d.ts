export interface IUser {
  id?: string;
  name: string;
  email: string;
  contactNumber: string;
  role: "customer" | "admin";
  authType?: string;
  avatarUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
