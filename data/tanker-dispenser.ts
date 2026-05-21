"use server";

import {
  getTankerDispensersService,
  getUnassignedDispensersService,
} from "@/services/tanker-dispenser";

export async function getTankerDispensers(tankerId: string) {
  try {
    const result = await getTankerDispensersService(tankerId);
    const mappedDispensers = result.map((dispenser: any) => ({
      id: dispenser._id.toString(),
      name: dispenser.name,
      currentStock: dispenser.litres || 0,
      isPublished: dispenser.isPublished || false,
    }));
    return { success: true, data: mappedDispensers };
  } catch (error: any) {
    console.error("❌ getTankerDispensers error:", error);
    return { success: false, data: [], message: error.message };
  }
}

export async function getUnassignedDispensers() {
  try {
    const result = await getUnassignedDispensersService();
    const mappedDispensers = result.map((dispenser: any) => ({
      id: dispenser._id.toString(),
      name: dispenser.name,
      litres: dispenser.litres || 0,
      isPublished: dispenser.isPublished || false,
    }));
    return { success: true, data: mappedDispensers };
  } catch (error: any) {
    console.error("❌ getUnassignedDispensers error:", error);
    return { success: false, data: [], message: error.message };
  }
}
