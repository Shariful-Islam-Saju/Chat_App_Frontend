import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Professional Chat App",
  description:
    "Hey it's me Shariful Islam. I'm using all the technology I know to create this App. Wish me luck",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F9F7F7]`}
      >
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </body>
    </html>
  );
}
