"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";

const DashboardPage = () => {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-6">
        <Image
          width={150}
          height={150}
          src={user.profilePic}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1">User ID: {user.id}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
