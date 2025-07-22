import Link from "next/link";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { authContext } from "../../../contexts/authContext";
import { ExclamationIcon } from "@heroicons/react/outline";

import {
  EmailPattern,
  maxLength,
  minLength,
} from "../../../libs/form-validator";
import Logo from "../../Layouts/Logo";
import Button from "../../UI/Public/Button";
import RadioVerticalListInput from "../../UI/Public/Inputs/RadioVerticalListInput/RadioVerticalListInput";
import TextInput from "../../UI/Public/Inputs/TextInput";
import GoogleLoginButton from "../../UI/Public/SocialLogin/GoogleLoginButton";
import FacebookLoginButton from "../../UI/Public/SocialLogin/FacebookLoginButton";
import Modal from "../../UI/Public/Modal";

const SignupForm = () => {
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  console.log("SignupForm");

  const { signup, loading, error, clearError } = useContext(authContext);

  const submitHandler = (data) => {
    console.log(data);
    signup(data.email, data.password, data.name, data.isAgent || false);
  };

  useEffect(() => {
    clearError();
  }, []);

  const handleCloseErrorModal = () => {
    clearError();
  };

  const roleItems = [
    // {
    //   id: "normal",
    //   name: "ผู้ใช้งานทั่วไป",
    //   description:
    //     "ฉันกำลังมองหาบ้าน คอนโด ที่ดิน เพื่อซื้อ/เช่า และลงประกาศทรัพย์สินของตัวเองเป็นบางครั้ง (ฟรี/จำกัดจำนวนประกาศ)",
    // },
    {
      id: "agent",
      name: "นายหน้าอสังหาริมทรัพย์ (Agent)",
      description:
        "ฉันต้องการลงประกาศจำนวนมาก (ฟรีไม่จำกัดจำนวนประกาศ) และใช้งานระบบสนันสนุนการทำงานต่างๆ ของ Agent",
    },
  ];

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 mx-2">
            <h1 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">
              ลงทะเบียนใช้งาน
            </h1>
            <div className="flex justify-center">{/* <Logo /> */}</div>
            <br />

            <div className="mb-6 space-y-3">
              <GoogleLoginButton text="ลงทะเบียนด้วย Google" />
              <FacebookLoginButton text="ลงทะเบียนด้วย Facebook" />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">หรือ</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
              <TextInput
                id="name"
                label="ชื่อผู้ใช้งาน"
                register={() =>
                  register("name", {
                    required: "กรุณาระบุชื่อ",
                    minLength: { ...minLength(5, "ชื่อ") },
                    maxLength: { ...maxLength(30, "ชื่อ") },
                  })
                }
                placeholder="สมชาย รักดี"
                unregister={unregister}
                error={errors.name}
                info="สามารถเปลี่ยนได้ภายหลัง"
              />

              <TextInput
                id="email"
                label="อีเมล"
                register={() =>
                  register("email", {
                    required: "กรุณาระบุอีเมล",
                    pattern: EmailPattern(),
                  })
                }
                unregister={unregister}
                error={errors.email}
              />

              <TextInput
                id="password"
                label="รหัสผ่าน"
                type="password"
                register={() =>
                  register("password", {
                    required: "กรุณาระบุรหัสผ่าน",
                    minLength: { ...minLength(6, "รหัสผ่าน") },
                    maxLength: { ...maxLength(64, "รหัสผ่าน") },
                  })
                }
                unregister={unregister}
                error={errors.password}
              />

              <div className="flex items-center">
                <input
                  id="isAgent"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register("isAgent")}
                />
                <label htmlFor="isAgent" className="ml-3 text-sm text-gray-700">
                  <span className="font-medium">
                    ฉันเป็นนายหน้าอสังหาริมทรัพย์ (Agent)
                  </span>
                  <div className="text-gray-500 text-xs mt-1">
                    ฉันต้องการลงประกาศจำนวนมาก
                    และใช้งานระบบสนับสนุนการทำงานต่างๆ ของ Agent
                    (ไม่มีค่าใช้จ่าย)
                  </div>
                </label>
              </div>

              {/* <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  รหัสผ่าน
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div> */}

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me //TODO: AGREE TERMS & SERVICE
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    เข้าสู่ระบบ?
                  </a>
                </div>
              </div> */}

              <div>
                <Button type="submit" variant="primary" loading={loading}>
                  ลงทะเบียน
                </Button>
              </div>
            </form>

            <div className="text-sm text-center  mt-2">
              มีบัญชีอยู่แล้ว?
              <Link
                href="/login"
                className="text-primary hover:text-primary-hover ml-2"
              >
                เข้าสู่ระบบ
              </Link>
            </div>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Twitter</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <Modal
        visible={!!error}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={error}
        buttonCaption="ตกลง"
        onClose={handleCloseErrorModal}
      />
    </>
  );
};

export default SignupForm;
