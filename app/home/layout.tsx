// app/home/layout.tsx
import React from "react";
import type { Metadata } from "next";
import "../globals.css"; // or wherever your global CSS is

export const metadata: Metadata = {
  title: "SJK Surgical",
  description: "",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>        
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
