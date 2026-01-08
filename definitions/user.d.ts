export interface IUser {
  id?: string;
  name: string;
  email: string;
  roleId: string;
  contactNumber: string;
  role: "customer" | "admin";
  authType?: string;
  avatarUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
