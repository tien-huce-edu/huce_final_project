"use client";
"use client";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AllInvoices from "@/app/components/Admin/Order/AllInvoices";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import Heading from "../../utils/Heading";


type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Elearning - Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <div className="flex  h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <AllInvoices />
        </div>
      </div>
    </div>
  );
};

export default Page;