import Company from "@/models/company";
import { ICompany } from "@/definitions/company";
import { connectDB } from "@/lib/db";

export async function getAllCompaniesService() {
  await connectDB();
  return await Company.find().sort({ createdAt: -1 }).lean();
}

export async function getCompanyByIdService(id: string) {
  await connectDB();
  return await Company.findById(id).lean();
}

export async function createCompanyService(data: Partial<ICompany>) {
  await connectDB();
  return await Company.create(data);
}

export async function updateCompanyService(
  id: string,
  data: Partial<ICompany>,
) {
  await connectDB();
  return await Company.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteCompanyService(id: string) {
  await connectDB();
  return await Company.findByIdAndDelete(id).lean();
}

export const updateCompanyDiscountAmountService = async (
  companyId: string,
  discountAmount: string,
) => {
  await connectDB();

  const company = (await Company.findById(companyId)) as any;

  if (!company) {
    throw new Error("Company not found");
  }

  company.discountAmount = Number(discountAmount);
  await company.save();

  return company;
};
