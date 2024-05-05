"use client";
import ThemeSwitcher from "@/app/utils/ThemeSwitcher";
import { FC, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  return (
    <div className="w-full flex item-center justify-end p-6 fixed top-5 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          3
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-[1000000000] rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          <div className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]">
            <div className="w-full flex items-center justify-between p-2">
              <p className="text-black dark:text-white">Title noti</p>
              <p
                className="text-black dark:text-white cursor-pointer"
                // onClick={() => handleNotificationStatusChange(item._id)}
              >
                Mark as read
              </p>
            </div>
            <p className="px-2 text-black dark:text-white">
              Description noti: Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Sunt, excepturi, et quos laboriosam at magni
              fugit ut, facere illum dolores odio dolorum? Harum aperiam,
              voluptas quibusdam tempora excepturi vero impedit.
            </p>
            <p className="p-2 text-black dark:text-white text-[14px]">
              2 hours ago
            </p>
          </div>
          <div className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]">
            <div className="w-full flex items-center justify-between p-2">
              <p className="text-black dark:text-white">Title noti</p>
              <p
                className="text-black dark:text-white cursor-pointer"
                // onClick={() => handleNotificationStatusChange(item._id)}
              >
                Mark as read
              </p>
            </div>
            <p className="px-2 text-black dark:text-white">
              Description noti: Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Sunt, excepturi, et quos laboriosam at magni
              fugit ut, facere illum dolores odio dolorum? Harum aperiam,
              voluptas quibusdam tempora excepturi vero impedit.
            </p>
            <p className="p-2 text-black dark:text-white text-[14px]">
              2 hours ago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
