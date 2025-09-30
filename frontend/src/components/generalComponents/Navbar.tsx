"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import navItems from "../../config/navConfig";
import { LuUser, LuShoppingBag, LuLogOut } from "react-icons/lu";
import { signOut, useSession } from "next-auth/react";
import { useMe } from "@/hooks/customerHooks";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: me } = useMe();
  const userName = me?.name ?? session?.user?.name ?? "";
  const userImage = me?.image ?? session?.user?.image ?? "";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };
  return (
    <div className="flex flex-col pt-[26px] border-b border-[#b0b0b0]">
      <div className="w-full flex justify-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Beaded Logo"
            className="w-[180px] h-[54px] object-contain cursor-pointer"
            width={600}
            height={600}
          />
        </Link>
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

              const getActiveItemId = () => {
                if (pathname === "/") {
                  return 1;
                }

                if (pathname.includes("/hot-deals/") && pathname.includes("/shop")) {
                  return 3;
                }
                if (pathname.includes("/eid-collection/") && pathname.includes("/shop")) {
                  return 4;
                }
                if (pathname.includes("/boishakhi-collection/") && pathname.includes("/shop")) {
                  return 5;
                }
                
                if (pathname.includes("/all/") && pathname.includes("/shop")) {
                  return 2;
                }

                return null;
              };

              const activeItemId = getActiveItemId();

              return items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`px-5 py-3 cursor-pointer ${
                      activeItemId === item.id ? "border border-black" : ""
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
          {userName ? (
            <Link
              href="/profile"
              className="flex items-center gap-2.5 text-[17px]"
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={28}
                  height={28}
                  className="rounded-full object-cover w-7 h-7"
                />
              ) : (
                <LuUser size={20} />
              )}
              <span className="max-w-[160px] truncate">{userName}</span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2.5 text-[17px]"
            >
              <LuUser size={20} />
              <span>SIGN IN</span>
            </Link>
          )}

          <button className="flex items-center gap-2.5 text-base">
            <LuShoppingBag size={20} />
            <span>CART: 0</span>
          </button>

          {userName && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 text-[17px]"
              aria-label="Sign out"
            >
              <LuLogOut size={20} />
              <span>SIGN OUT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
