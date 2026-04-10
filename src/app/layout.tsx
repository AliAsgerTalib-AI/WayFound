import React from "react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen selection:bg-primary-container selection:text-on-primary">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
