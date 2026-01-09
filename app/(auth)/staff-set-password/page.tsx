import SetPassword from "@/components/(auth)/staff-set-password/set-password";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const id = query.id || "";

  return <SetPassword id={id} />;
}
