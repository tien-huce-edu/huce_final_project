"use client";
import React, { FC } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { Box, CircularProgress } from "@mui/material";
import { PiUsersFourLight } from "react-icons/pi";
import OrdersAnalytics from "../Analytics/OrderAnalytics";
import AllInvoices from "../Order/AllInvoices";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={45}
          color={value && value > 99 ? "info" : "error"}
          thickness={4}
          style={{ zIndex: open ? -1 : 1 }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Box>
      </Box>
    );
  };

const DashboardWidgets: FC<Props> = ({ open }) => {
  return  <div className="mt-[30px] min-h-screen">
  <div className="grid 800px:grid-cols-[75%,25%]">
    <div className=" pt-[10px]  800px:p-7 ">
      <UserAnalytics isDashboard={true} />
    </div>

    <div className=" pt-[20px] 800px:pt-[40px] p-[5px] 800px:block flex items-center justify-between">
      <div className="w-full dark:bg-[#111C43] rounded-sm shadow my-10 mr-[10px] 800px:my-8">
        <div className="flex items-center p-5 justify-between">
          <div className="">
            <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
            <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
              {/* {ordersComparePercentage?.currentMonth} */}
              150
            </h5>
            <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
              Sales Obtained
            </h5>
          </div>
          <div>
            <CircularProgressWithLabel
            //   value={ordersComparePercentage?.percentChange > 0 ? 100 : 0}
            value={100}
              open={open}
            />
            <h5 className="text-center pt-4 dark:text-[#fff] text-black">
              {/* {ordersComparePercentage?.percentChange > 0
                ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                : "-" +
                  ordersComparePercentage?.percentChange.toFixed(2)}{" "} */}
                  150%
            </h5>
          </div>
        </div>
      </div>

      <div className="w-full dark:bg-[#111C43] rounded-sm shadow 800px:my-8 my-10">
        <div className="flex items-center p-5 justify-between">
          <div className="">
            <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
            <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
              {/* {userComparePercentage?.currentMonth} */}
              150
            </h5>
            <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
              New Users
            </h5>
          </div>
          <div>
            <CircularProgressWithLabel
            //   value={userComparePercentage?.percentChange > 0 ? 100 : 0}
            value={100}
              open={open}
            />
            <h5 className="text-center pt-4 dark:text-[#fff] text-black">
              {/* {userComparePercentage?.percentChange > 0
                ? "+" + userComparePercentage?.percentChange.toFixed(2)
                : "-" +
                  userComparePercentage?.percentChange.toFixed(2)}{" "} */}
              150%
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="grid 800px:grid-cols-[65%,35%] mt-[20px]">
    <div className="dark:bg-[#111c43] w-[95%] 800px:w-[94%] mt-[0px]  h-[30vh] 800px:h-[40vh] shadow-sm m-auto ">
      <OrdersAnalytics isDashboard={true} />
    </div>
    <div className="pr-5">
      <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poppins pb-3">
        Recent Transactions
      </h5>
      <AllInvoices isDashboard={true} />
    </div>
  </div>
</div>;
};

export default DashboardWidgets;
