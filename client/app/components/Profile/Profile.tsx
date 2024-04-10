"use client";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar);
  const [logout, setLogout] = useState(false);

  const {} = useLogOutQuery(undefined, { skip: !logout ? true : false });

  const [active, setActive] = useState(1);

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
    redirect("/");
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className="w-[85%] flex mx-auto h-screen">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 bg-white border dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] dark:shadow-sm shadow-sm mt-[80px] mb-[80px] sticky ${scroll} left-[30px] `}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo user={user} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
    </div>
  );
};

export default Profile;
