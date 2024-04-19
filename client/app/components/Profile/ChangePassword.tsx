"use client"
import { styles } from "@/app/styles/style";
import { useEditPasswordMutation } from "@/redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [editPassword, { isSuccess, error }] = useEditPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Update success");
    }
    if (error && typeof error === "object") {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Old password and new password not match");
      return;
    }
    await editPassword({ oldPassword, newPassword });
  };
  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px-text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
        Change Passwords
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Old Password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] pt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              New Password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] pt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Confirm Password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] pt-2">
            <input
              className=" w-[95%] h-[40px] text-center border border-[#37a39a] text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer hover:bg-[#37a39a] hover:text-white transition"
              type="submit"
              value="Update"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
