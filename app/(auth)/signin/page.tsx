"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900">Doctor Portal</h2>
        <p className="text-gray-500">Sign in to access your dashboard</p>
        
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="h-5 w-5" 
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}