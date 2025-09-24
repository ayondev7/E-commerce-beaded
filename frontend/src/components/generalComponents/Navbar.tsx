"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import navItems from "../../config/navConfig";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="2xl:px-[143px] 2xl:py-[36px] flex justify-between items-center">
      <Image
        src="/logo.png"
        alt="Beaded Logo"
        className="w-[180px] h-[54px] object-contain"
        width={600}
        height={600}
      />
      <nav>
        <ul className="flex gap-x-[32px] text-[17px]">
          {(() => {
            const items = navItems as {
              id: number;
              label: string;
              href: string;
            }[];

            return items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`px-5 py-3 cursor-pointer ${pathname === item.href ? 'border border-black' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ));
          })()}
        </ul>
      </nav>

      <div>
        
      </div>
    </div>
  );
};

export default Navbar;
