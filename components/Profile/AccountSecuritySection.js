import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ShieldCheckIcon, KeyIcon, ExclamationIcon, CheckIcon, XIcon } from "@heroicons/react/outline";
import TextInput from "../UI/Public/Inputs/TextInput";
import Modal from "../UI/Public/Modal";
import { minLength, maxLength } from "../../libs/form-validator";
import { apiClient } from "../../lib/api/client";
import { t } from "../../lib/utils/translator";

const AccountSecuritySection = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const getPasswordStatus = () => {
    // Users who signed up with email have passwords
    if (user.provider === 'email') {
      return {
        hasPassword: true,
        canChangePassword: true,
        message: 'คุณสามารถเปลี่ยนรหัสผ่านได้'
      };
    } else {
      // Users who signed up with Google/Facebook don't have passwords
      return {
        hasPassword: false,
        canChangePassword: false,
        message: `คุณเข้าสู่ระบบด้วย ${user.provider === 'google' ? 'Google' : 'Facebook'} ไม่จำเป็นต้องมีรหัสผ่าน`
      };
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setApiError("");
    reset();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiError("");
    reset();
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setApiError("");

    try {
      await apiClient.auth.updatePassword(
        formData.currentPassword,
        formData.newPassword
      );
      setSuccess(true);
      setIsEditing(false);
      reset();
    } catch (error) {
      const errorMessage = t(error.message) || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";
      setApiError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
  };

  const handleCloseApiErrorModal = () => {
    setApiError("");
  };

  // Watch newPassword for confirm validation
  const newPassword = watch("newPassword");

  // Auto-focus current password when editing starts
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        const currentPasswordInput = document.getElementById('currentPassword');
        if (currentPasswordInput) {
          currentPasswordInput.focus();
        }
      }, 100);
    }
  }, [isEditing]);

  const passwordStatus = getPasswordStatus();

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            🔐 ความปลอดภัยบัญชี
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            จัดการความปลอดภัยและการเข้าถึงบัญชีของคุณ
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {/* Password Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <div className="mt-1">
                {passwordStatus.hasPassword ? (
                  <>
                    {!isEditing ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              รหัสผ่านได้รับการตั้งค่าแล้ว
                            </p>
                            <p className="text-sm text-green-600">
                              {passwordStatus.message}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleEdit}
                          className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <KeyIcon className="w-4 h-4 mr-2" />
                          เปลี่ยนรหัสผ่าน
                        </button>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="password-input-thai">
                              <TextInput
                                id="currentPassword"
                                label="รหัสผ่านปัจจุบัน"
                                type="password"
                                disabled={isSaving}
                                register={() =>
                                  register("currentPassword", {
                                    required: "กรุณาระบุรหัสผ่านปัจจุบัน",
                                    minLength: { ...minLength(6, "รหัสผ่านปัจจุบัน") },
                                    maxLength: { ...maxLength(64, "รหัสผ่านปัจจุบัน") },
                                  })
                                }
                                unregister={unregister}
                                error={errors.currentPassword}
                              />
                            </div>

                            <div className="password-input-thai">
                              <TextInput
                                id="newPassword"
                                label="รหัสผ่านใหม่"
                                type="password"
                                disabled={isSaving}
                                register={() =>
                                  register("newPassword", {
                                    required: "กรุณาระบุรหัสผ่านใหม่",
                                    minLength: { ...minLength(6, "รหัสผ่านใหม่") },
                                    maxLength: { ...maxLength(64, "รหัสผ่านใหม่") },
                                  })
                                }
                                unregister={unregister}
                                error={errors.newPassword}
                              />
                            </div>

                            <div className="password-input-thai">
                              <TextInput
                                id="confirmPassword"
                                label="ยืนยันรหัสผ่านใหม่"
                                type="password"
                                disabled={isSaving}
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
                          </div>

                          <div className="flex space-x-3 pt-2">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              <CheckIcon className="w-4 h-4 mr-1" />
                              {isSaving ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              <XIcon className="w-4 h-4 mr-1" />
                              ยกเลิก
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ExclamationIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          ไม่มีรหัสผ่าน
                        </p>
                        <p className="text-sm text-blue-600">
                          {passwordStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                เคล็ดลับความปลอดภัย
              </label>
              <div className="space-y-2">
                {user.provider === 'email' && (
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 text-sm">!</span>
                    <span className="text-sm text-gray-700">
                      แนะนำให้เปลี่ยนรหัสผ่านเป็นระยะๆ เพื่อความปลอดภัย
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        visible={success}
        Icon={CheckIcon}
        type="success"
        title="เปลี่ยนรหัสผ่านสำเร็จ"
        desc="รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว"
        buttonCaption="ตกลง"
        onClose={handleCloseSuccessModal}
      />

      {/* Error Modal */}
      <Modal
        visible={!!apiError}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={apiError}
        buttonCaption="ตกลง"
        onClose={handleCloseApiErrorModal}
      />
    </div>
  );
};

export default AccountSecuritySection; 