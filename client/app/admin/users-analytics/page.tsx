"use client";
import UserAnalytics from "@/app/components/Admin/Analytics/UserAnalytics";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";


type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Elearning - Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <div className="flex">
        <div className="1500px:w-[19%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <UserAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;