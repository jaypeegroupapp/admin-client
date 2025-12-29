import { ActionsClientPage } from "@/components/(dashboard)/actions/client";
import { getActions } from "@/data/action";

export const dynamic = "force-dynamic";

export default async function ActionsPage() {
  const result = await getActions();
  return <ActionsClientPage initialActions={result.data || []} />;
}
