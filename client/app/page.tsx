"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import "./globals.css";

interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="ELearning"
        description="Elearning là một nền tảng dành cho sinh viên và giảng viên trao đổi việc giảng dạy và học tập online"
        keywords="Programing, Elearning, Online, Study, Teaching, Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <Hero />
    </div>
  );
};

export default Page;
