export interface IMine {
  id?: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MineFormState = {
  errors: {
    name?: string[];
    global?: string[];
  };
  message: string;
};
