"use client";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AllCourses from "@/app/components/Admin/Course/AllCourses";

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Admin"
          description="Elearning là một nền tảng dành cho sinh viên và giảng viên trao đổi việc giảng dạy và học tập online"
          keywords="Programing, Elearning, Online, Study, Teaching, Learning"
        />
        <div className="flex h-screen">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar />
            </div>
            <div className="1500px:w-[80%] w-4/5">
                <DashboardHero />
                <AllCourses />
            </div>

        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
