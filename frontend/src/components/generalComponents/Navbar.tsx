"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import navItems from "../../config/navConfig";
import { LuUser, LuShoppingBag } from "react-icons/lu";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col pt-[35px] pb-[49px]">
      <div className="w-full flex justify-center">
        <Image
          src="/logo.png"
          alt="Beaded Logo"
          className="w-[180px] h-[54px] object-contain"
          width={600}
          height={600}
        />
      </div>
      <div className="2xl:px-[149px] 2xl:py-[36px] flex justify-between items-center">
        <nav>
          <ul className="flex gap-x-[24px] text-[17px]">
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
                    className={`px-5 py-3 cursor-pointer ${
                      pathname === item.href ? "border border-black" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ));
            })()}
          </ul>
        </nav>

        <div className="flex items-center gap-x-[32px]">
          <button className="flex items-center gap-2.5 text-[17px]">
            <LuUser size={20} />
            <span>SIGN IN</span>
          </button>

          <button className="flex items-center gap-2.5 text-base">
            <LuShoppingBag size={20} />
            <span>CART: 0</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
