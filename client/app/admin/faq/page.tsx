"use client";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import EditFaq from "../../components/Admin/Customization/EditFaq";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Elearning - Admin"
        description="Elearning là một nền tảng dành cho sinh viên và giảng viên trao đổi việc giảng dạy và học tập online"
        keywords="Programing, Elearning, Online, Study, Teaching, Learning"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] h-screen">
          <DashboardHero />
          {/* <CreateCourse /> */}
          {/* <EditHero /> */}
          <EditFaq />
        </div>
      </div>
    </div>
  );
};

export default page;
