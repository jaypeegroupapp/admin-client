// services/truck.ts
import { getTruckByCompanyIdService, getTrucksService } from "@/services/truck";

const truckMap = (truck: any) => ({
  id: truck._id.toString(),
  plateNumber: truck.plateNumber,
  registrationNumber: truck.registrationNumber,
  vinNumber: truck.vinNumber,
  colour: truck.colour,
  make: truck.make,
  model: truck.model,
  year: truck.year,
  isActive: truck.isActive,
  userId: truck.userId,
});

export async function getTrucks() {
  // This function will call a server endpoint - but simplest is to call a small API route.
  // If you prefer to call server action directly from server component, you can import getTrucksServer there.
  try {
    const trucks = await getTrucksService();

    return Array.isArray(trucks) ? trucks.map(truckMap) : [];
  } catch (err) {
    return [];
  }
}

export async function getTrucksByCompanyId(companyId: string) {
  // This function will call a server endpoint - but simplest is to call a small API route.
  // If you prefer to call server action directly from server component, you can import getTrucksServer there.
  try {
    const trucks = await getTruckByCompanyIdService(companyId);

    return Array.isArray(trucks) ? trucks.map(truckMap) : [];
  } catch (err) {
    return [];
  }
}
