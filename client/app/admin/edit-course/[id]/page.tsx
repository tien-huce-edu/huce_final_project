"use client";
import EditCourse from "@/app/components/Admin/Course/EditCourse";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";

type Props = {};

const Page = (props: any) => {

  const id = props.params.id;
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
        <div className="w-[85%]">
          <DashboardHero />
          {/* <CreateCourse /> */}
          <EditCourse id={id}/>
        </div>
      </div>
    </div>
  );
};

export default Page;
