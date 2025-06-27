import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import TextInput from "../UI/Public/Inputs/TextInput";
import Modal from "../UI/Public/Modal";
import { minLength, maxLength } from "../../libs/form-validator";
import { apiClient } from "../../lib/api/client";
import { t } from "../../lib/utils/translator";

const PasswordSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm();

  const submitHandler = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.auth.updatePassword(
        data.currentPassword,
        data.newPassword
      );
      setSuccess(true);
      reset(); // Clear the form
    } catch (err) {
      const errorMessage =
        t(err.message) || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
  };

  // Watch newPassword for confirm validation
  const newPassword = watch("newPassword");

  return (
    <>
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              เปลี่ยนรหัสผ่าน
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              อัพเดทรหัสผ่านของคุณเพื่อความปลอดภัย
            </p>
          </div>

          <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
            <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="currentPassword"
                    label="รหัสผ่านปัจจุบัน"
                    type="password"
                    register={() =>
                      register("currentPassword", {
                        required: "กรุณาระบุรหัสผ่านปัจจุบัน",
                      })
                    }
                    unregister={unregister}
                    error={errors.currentPassword}
                  />
                </div>

                {/* Empty space to force new row */}
                <div className="hidden sm:block sm:col-span-3"></div>

                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="newPassword"
                    label="รหัสผ่านใหม่"
                    type="password"
                    register={() =>
                      register("newPassword", {
                        required: "กรุณาระบุรหัสผ่านใหม่",
                        minLength: { ...minLength(6, "รหัสผ่าน") },
                        maxLength: { ...maxLength(64, "รหัสผ่าน") },
                      })
                    }
                    unregister={unregister}
                    error={errors.newPassword}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="confirmPassword"
                    label="ยืนยันรหัสผ่านใหม่"
                    type="password"
                    register={() =>
                      register("confirmPassword", {
                        required: "กรุณายืนยันรหัสผ่านใหม่",
                        validate: (value) =>
                          value === newPassword || "รหัสผ่านไม่ตรงกัน",
                      })
                    }
                    unregister={unregister}
                    error={errors.confirmPassword}
                  />
                </div>

                {error && (
                  <div className="col-span-6">
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-red-800">
                            {error}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-span-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={!isDirty || loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        visible={success}
        type="success"
        title="เปลี่ยนรหัสผ่านสำเร็จ"
        desc="รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว"
        buttonCaption="ตกลง"
        Icon={CheckIcon}
        onClose={handleCloseSuccessModal}
      />
    </>
  );
};

export default PasswordSection;
