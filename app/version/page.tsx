import React from "react";

const Page = () => {
  const buildVersion = "1.0.15"; // 👈 change manually

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 w-[350px] text-center">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          🚀 Version Check
        </h1>

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">
            Current Build Version
          </p>
          <p className="text-2xl font-bold text-black tracking-wide">
            {buildVersion}
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Last updated manually
        </p>

      </div>
    </div>
  );
};

export default Page;