"use client";

type Props = {
  name: string;
  isPending?: boolean;
};

export const SubmitButton = ({ name, isPending }: Props) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="mt-2 w-full py-2.5 rounded-full bg-black text-white font-semibold hover:bg-gray-200 transition"
    >
      {isPending ? "Loading..." : name}
    </button>
  );
};
