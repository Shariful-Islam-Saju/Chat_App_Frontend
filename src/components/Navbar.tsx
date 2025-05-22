"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useUserStore } from "@/store/useUserStore";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/api/auth/logout");
      setUser(null); // Clear Zustand user
      router.push("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const authLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  const guestLinks = [
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold">
            <Link href="/">Shariful Islam</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {(user ? authLinks : guestLinks).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-500 font-medium transition"
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500 font-medium transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          {(user ? authLinks : guestLinks).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-700 hover:text-blue-500 font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block w-full text-left text-gray-700 hover:text-red-500 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
