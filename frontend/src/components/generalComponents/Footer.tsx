import Link from "next/link";
import React from "react";
import { RiFacebookFill, RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <div className="bg-[#1E1E1E] xl:px-10 2xl:px-[60px] 3xl:px-[150px] py-[38px] flex justify-between items-center">
      <div className="flex justify-center items-center">
        <span className="text-white 2xl:text-xl mr-[18px]">Follow us on</span>
        <Link className="p-2.5 bg-white rounded-full mr-2" href="/">
          <RiFacebookFill className="size-[24px]" />
        </Link>
        <Link className="p-2.5 bg-white rounded-full" href="/">
          <RiInstagramFill className="size-[24px]" />
        </Link>
      </div>
      <div className="2xl:text-xl text-white">Copyrights @ 2025 All rights reserved by <span className="text-[#67C18C]">beaded bangladesh</span></div>
       <div className="2xl:text-xl text-white">Made with love by <span className="text-[#67C18C]">Abdur Rahman Ayon</span></div>
    </div>
  );
};

export default Footer;
