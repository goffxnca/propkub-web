import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { MailIcon, CheckIcon, ExclamationCircleIcon, XIcon } from "@heroicons/react/outline";
import TextInput from "../UI/Public/Inputs/TextInput";
import Button from "../UI/Public/Button";
import { EmailPattern } from "../../libs/form-validator";
import { apiClient } from "../../lib/api/client";
import { t } from "../../libs/translator";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isProviderError, setIsProviderError] = useState(false);
  
  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleClose = () => {
    reset();
    setError("");
    setSuccess(false);
    setLoading(false);
    setIsProviderError(false);
    onClose();
  };

  const submitHandler = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await apiClient.auth.forgotPassword(data.email);
      
      // Check if response contains provider-specific messages (should be treated as errors)
      if (response.message && response.message.includes("This account was registered with")) {
        const errorMessage = t(response.message) || "เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน";
        setError(errorMessage);
        setIsProviderError(true);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = t(err.message) || "เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Transition.Root show={visible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg px-6 py-8 text-center overflow-hidden shadow-xl transform transition-all w-full max-w-sm">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
                  </div>
                  
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 mb-2">
                    ส่งอีเมลสำเร็จ
                  </Dialog.Title>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    เราได้ส่งลิ้งค์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
                  </p>
                  
                  <button
                    type="button"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    onClick={handleClose}
                  >
                    ตกลง
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  if (isProviderError) {
    return (
      <Transition.Root show={visible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg px-6 py-8 text-center overflow-hidden shadow-xl transform transition-all w-full max-w-sm">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                    <ExclamationCircleIcon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                  </div>
                  
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 mb-2">
                    โปรดเข้าสู่ระบบด้วยวิธีอื่น
                  </Dialog.Title>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {error}
                  </p>
                  
                  <button
                    type="button"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    onClick={handleClose}
                  >
                    ตกลง
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-6 py-6 text-center overflow-hidden shadow-xl transform transition-all w-full max-w-sm">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={handleClose}
                  >
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <MailIcon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                
                <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 mb-2">
                  ลืมรหัสผ่าน?
                </Dialog.Title>
                
                <p className="text-gray-600 mb-6">
                  กรอกอีเมลของคุณ เราจะส่งลิ้งค์รีเซ็ตให้คุณ
                </p>

                <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
                  <div className="text-left">
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
                      placeholder="your@email.com"
                    />
                  </div>

                  {error && (
                    <div className="text-left rounded-md bg-red-50 p-3">
                      <div className="flex">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="ml-2 text-sm text-red-800">{error}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      className="w-full"
                    >
                      ยืนยัน
                    </Button>
                    <button
                      type="button"
                      className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
                      onClick={handleClose}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ForgotPasswordModal; 