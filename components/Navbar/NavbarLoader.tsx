"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(
  () => import("@/components/Navbar/Navbar"),
  { ssr: false, loading: () => null }
);

export function NavbarLoader() {
  return <Navbar />;
}
