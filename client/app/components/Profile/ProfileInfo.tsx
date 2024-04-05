import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarDefault from "../../../public/assets/image/avatar.jpg";
import { styles } from "@/app/styles/style";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar?: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error, isLoading }] =
    useUpdateAvatarMutation();
  const [
    editProfile,
    { isSuccess: editProfileSuccess, error: editProfileError },
  ] = useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = async (e: any) => {
    if (e.target.files[0].size > 1000 * 1000 * 8) {
      const size = Math.round(e.target.files[0].size / 1000 / 1000);
      toast.error(
        `[file ${size}MB > 1MB] file size is too large, please pick a smaller file`,
      );
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };
  useEffect(() => {
    if (isSuccess || editProfileSuccess) {
      setLoadUser(true);
    }
    if (error || editProfileError) {
      if (error && typeof error === "object") {
        {
          if ("data" in error) {
            const errorData = error as any;
            toast.error(errorData.data.message);
          }
        }
      }
      if (editProfileError && typeof editProfileError === "object") {
        {
          if ("data" in editProfileError) {
            const errorData = editProfileError as any;
            toast.error(errorData.data.message);
          }
        }
      }
    }
  }, [isSuccess, error, editProfileSuccess, editProfileError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      editProfile({ name });
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={
              user?.avatar || avatar ? user.avatar.url || avatar : avatarDefault
            }
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            // accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2">Email Address</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0 border-slate-500`}
                required
                value={user?.email}
                disabled
              />
            </div>
            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer hover:bg-[#37a39a] transition`}
              required
              value="Update"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
