"use client";

import { motion } from "framer-motion";
import LoginForm from "./form";

const Login = () => {
  return (
    <div className="flex h-[98vh] items-center justify-center bg-white text-white">
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative md:rounded-3xl bg-black text-white md:shadow-2xl border border-gray-200 w-full max-w-md md:max-w-sm h-screen md:h-[600px] overflow-hidden"
      >
        <div className="absolute top-30 md:top-10 w-full flex flex-col items-center">
          <h3 className="font-mono text-3xl font-semibold tracking-wide text-white">
            JayPee Groups
          </h3>
        </div>

        <div className="absolute bottom-0 w-full bg-white text-black py-10 px-8">
          <h3 className="font-mono text-xl mb-6 text-center">Login</h3>
          <LoginForm />
        </div>
      </motion.main>
    </div>
  );
};

export default Login;
