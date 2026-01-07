"use client";

import { UseFormRegister } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  isPending?: boolean;
  stateError?: any;
  register: UseFormRegister<any>;
  errors: any;
};

const InputValidated = ({
  label,
  name,
  type = "text",
  placeholder,
  isPending,
  stateError,
  register,
  errors,
}: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className={`flex flex-col mb-4 ${isPending ? "bg-gray-100" : ""}`}>
      <label className="text-black text-sm mb-1">{label}</label>
      <div className="relative">
        <input
          {...register(name, { required: `${label} is required` })}
          placeholder={placeholder}
          type={
            type === "password" && !show
              ? "password"
              : type === "number"
              ? "number"
              : "text"
          }
          disabled={isPending}
          className="w-full px-4 py-2 rounded-full bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[name] && (
        <span className="text-red-400 text-xs mt-1">
          {errors[name]?.message}
        </span>
      )}
      {stateError && <span className="text-red-500">{stateError[name]}</span>}
    </div>
  );
};

export default InputValidated;
