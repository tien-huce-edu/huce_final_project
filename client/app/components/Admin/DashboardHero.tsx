"use client";
import { FC, useState } from "react";
import DashboardWidgets from "../../components/Admin/Widgets/DashboardWidgets";
import DashboardHeader from "./DashboardHeader";

type Props = {
  isDashboard?: boolean;
};

const DashboardHero: FC<Props> = ({ isDashboard }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DashboardHeader open={open} setOpen={setOpen} />
      {isDashboard && <DashboardWidgets open={open} />}
    </div>
  );
};

export default DashboardHero;
