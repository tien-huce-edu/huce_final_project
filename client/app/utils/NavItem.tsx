import Link from "next/link";
import React, { FC } from "react";

export const NavItemData = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "About", path: "/about" },
  { name: "Policy", path: "/policy" },
  { name: "FAQ", path: "/faq" },
];

type props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItem: FC<props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {NavItemData &&
          NavItemData.map((item, index) => (
            <Link href={`${item.path}`} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } text-[18px] px-6 font-Poppins font-[400]`}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full flex flex-col text-center py-6">
            {NavItemData &&
              NavItemData.map((item, index) => (
                <Link href={"/"} passHref>
                  <span
                    className={`${
                      activeItem === index
                        ? "dark:text-[#37a39a] text-[crimson]"
                        : "dark:text-white text-black"
                    } text-[18px] px-6 font-Poppins font-[400]`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NavItem;
