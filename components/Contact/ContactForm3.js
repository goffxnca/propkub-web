import { useState } from "react";
import { Switch } from "@headlessui/react";
import Logo from "../Layouts/Logo";
import Image from "next/image";
import TextInput from "../UI/Public/Inputs/TextInput";
import { useForm } from "react-hook-form";
import { EmailPattern, maxLength, minLength } from "../../libs/form-validator";
import TextAreaInput from "../UI/Public/Inputs/TextAreaInput";
import Button from "../UI/Public/Button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ContactForm = () => {
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-white px-4 overflow-hidden sm:px-6 lg:px-8">
      <div className="relative bg-red max-w-xl mx-auto">
        {/* <div className="text-center">
          <Image
            src="/icons/contact.svg"
            width={300}
            height={300}
            layout="fixed"
            alt="contact illustration icon"
          />
        </div> */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            ติดต่อทีมงาน <Logo />
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            เรามีทีมงานมืออาชีพพร้อมช่วยเหลือคุณตลอดเวลา
            โปรดกรอกข้อมูลด้านล่างเพื่อรับการติดต่อกลับ.
          </p>
        </div>
        <div className="mt-12">
          <form
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
              <div className="col-span-6">
                <TextInput
                  id="name"
                  label="ชื่อ-นามสกุล"
                  register={() =>
                    register("name", {
                      required: "กรุณาระบุชื่อ",
                      minLength: { ...minLength(8, "ชื่อ") },
                      maxLength: { ...maxLength(30, "ชื่อ") },
                    })
                  }
                  unregister={unregister}
                  error={errors.name}
                />
              </div>

              <div className="col-span-6">
                <TextInput
                  id="company"
                  label="บริษัท"
                  register={() =>
                    register("company", {
                      minLength: { ...minLength(8, "บริษัท") },
                      maxLength: { ...maxLength(50, "บริษัท") },
                    })
                  }
                  placeholder="ถ้ามี"
                  unregister={unregister}
                  error={errors.company}
                />
              </div>

              <div className="col-span-6">
                <TextInput
                  id="email"
                  label="อีเมล"
                  register={() =>
                    register("email", {
                      required: "กรุณาระบุอีเมล",
                      minLength: { ...minLength(8, "อีเมล") },
                      maxLength: { ...maxLength(30, "อีเมล") },
                    })
                  }
                  placeholder=""
                  unregister={unregister}
                  error={errors.email}
                />
              </div>

              <div className="col-span-6">
                <TextInput
                  id="phone"
                  label="เบอร์ติดต่อกลับ"
                  register={() =>
                    register("phone", {
                      required: "กรุณาระบุเบอร์ติดต่อกลับ",
                      minLength: { ...minLength(8, "เบอร์ติดต่อกลับ") },
                      maxLength: { ...maxLength(30, "เบอร์ติดต่อกลับ") },
                    })
                  }
                  placeholder=""
                  unregister={unregister}
                  error={errors.phone}
                />
              </div>

              <div className="col-span-6">
                <TextAreaInput
                  id="detail"
                  label="ข้อความ"
                  register={() =>
                    register("detail", {
                      required: "กรุณาระบุข้อความ",
                      minLength: { ...minLength(8, "ข้อความ") },
                      maxLength: { ...maxLength(30, "ข้อความ") },
                    })
                  }
                  rows={10}
                  unregister={unregister}
                  error={errors.detail}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" variant="primary" loading={false}>
                ส่งข้อมูล
              </Button>
            </div>

            {/* <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                ชื่อ
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700"
              >
                นามสกุล
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                บริษัท
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="company"
                  id="company"
                  autoComplete="organization"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                อีเมล
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-gray-700"
              >
                เบอร์โทรศัพท์
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  autoComplete="tel"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  placeholder=""
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                ข้อความ
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                  defaultValue={""}
                />
              </div>
            </div> */}

            {/* <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Switch
                    checked={agreed}
                    onChange={setAgreed}
                    className={classNames(
                      agreed ? "bg-indigo-600" : "bg-gray-200",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    )}
                  >
                    <span className="sr-only">Agree to policies</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        agreed ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                      )}
                    />
                  </Switch>
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-500">
                    By selecting this, you agree to the{" "}
                    <a href="#" className="font-medium text-gray-700 underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-medium text-gray-700 underline">
                      Cookie Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ส่งข้อมูล
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
