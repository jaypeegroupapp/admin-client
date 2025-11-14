export const COMPANY = "company";
const adminUser = {
  username: "blissfuladmin.com",
  password: "$2b$10$EC7lxhH3mfHotHgMs9x5aOtmUSsHj9BYGDNuCIDs7ICCPLJlnfUPa",
  authType: "credentials",
  role: "admin",
  createdAt: {
    $date: "2025-06-08T14:55:20.738Z",
  },
  updatedAt: {
    $date: "2025-06-08T14:55:20.738Z",
  },
  __v: 0,
};

export const registerFormData = [
  {
    name: "name",
    label: "Company Name",
    placeholder: "Enter company name",
    isRequired: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter company email",
    isRequired: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
    isRequired: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Password",
    isRequired: true,
  },
];
