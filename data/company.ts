"use server";

import {
  getAllCompaniesService,
  getCompanyByIdService,
  createCompanyService,
  updateCompanyService,
  deleteCompanyService,
} from "@/services/company";
import { ICompany } from "@/definitions/company";

const mapCompany = (company: any): ICompany => ({
  id: company._id?.toString?.() ?? company.id ?? "",
  userId: company.userId?.toString?.() ?? company.userId ?? "",
  companyName: company.companyName,
  registrationNumber: company.registrationNumber,
  contactEmail: company.contactEmail,
  contactPhone: company.contactPhone,
  billingAddress: company.billingAddress,
  vatNumber: company.vatNumber ?? "",
  invoiceFile: company.invoiceFile ?? "",
  creditLimit: company.creditLimit ?? 0,
  balance: company.balance ?? 0,
  createdAt: company.createdAt ?? "",
  updatedAt: company.updatedAt ?? "",
});

export async function getCompanies() {
  try {
    const result = await getAllCompaniesService();
    const companies = Array.isArray(result) ? result.map(mapCompany) : [];
    return { success: true, data: companies };
  } catch (error: any) {
    console.error("❌ getCompanies error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch companies",
    };
  }
}

export async function getCompanyById(id: string) {
  try {
    const company = await getCompanyByIdService(id);
    if (!company) return { success: false, message: "Company not found" };
    return { success: true, data: mapCompany(company) };
  } catch (error: any) {
    console.error("❌ getCompanyById error:", error);
    return { success: false, message: error.message };
  }
}

export async function createCompany(data: ICompany) {
  try {
    const result = await createCompanyService(data);
    return { success: true, data: mapCompany(result) };
  } catch (error: any) {
    console.error("❌ createCompany error:", error);
    return { success: false, message: error.message };
  }
}

export async function updateCompany(id: string, data: Partial<ICompany>) {
  try {
    const result = await updateCompanyService(id, data);
    return { success: true, data: mapCompany(result) };
  } catch (error: any) {
    console.error("❌ updateCompany error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteCompany(id: string) {
  try {
    await deleteCompanyService(id);
    return { success: true };
  } catch (error: any) {
    console.error("❌ deleteCompany error:", error);
    return { success: false, message: error.message };
  }
}
