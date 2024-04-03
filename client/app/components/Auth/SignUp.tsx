"use client";
import { styles } from "@/app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useFormik } from "formik";
import { useState, FC, useEffect } from "react";
import toast from "react-hot-toast";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Tên không được để trống")
    .max(100, "Tên không quá 100 ký tứ"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  password: Yup.string()
    .required("Password không được để trống")
    .min(6, "Password phải lớn hơn 6 ký tự"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Đăng ký thành công";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: {
      name: "Nguyen Van Tien",
      email: "tienhg201@gmail.com",
      password: "123123123",
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name,
        email,
        password,
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className="w-full">
      <h1 className={`${styles.tittle}`}>Đăng ký vào hệ thống</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className={`${styles.label}`}>
            Nhập tên của bạn
          </label>
          <input
            type="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Nguyen Van A"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>
        <div>
          <label htmlFor="email" className={`${styles.label}`}>
            Nhập email của bạn
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="login_mail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="" className={`${styles.label}`}>
            Nhập mật khẩu của bạn
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="Your password"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {show ? (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        </div>
        <div className="w-full mt-5">
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub
            size={30}
            className="cursor-pointer ml-2 text-black dark:text-white"
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] p-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
