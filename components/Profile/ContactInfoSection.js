import { PhoneIcon, PencilIcon, CheckIcon, XIcon, ExclamationIcon } from "@heroicons/react/outline";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "../../lib/api/client";
import { authContext } from "../../contexts/authContext";
import {  MobilePhonePattern, LineIdPattern } from "../../libs/form-validator";
import TextInput from "../UI/Public/Inputs/TextInput";
import Modal from "../UI/Public/Modal";

const ContactInfoSection = ({ user }) => {
  const { setUser } = useContext(authContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: user.phone || "",
      line: user.line || ""
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setApiError("");
    reset({
      phone: user.phone || "",
      line: user.line || ""
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiError("");
    reset({
      phone: user.phone || "",
      line: user.line || ""
    });
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setApiError("");
    
    try {
      console.log("Saving contact info:", formData);
      
      const updatedUser = await apiClient.auth.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      console.log("Contact info saved successfully!");
    } catch (error) {
      console.error("Failed to save contact info:", error);
      setApiError(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseApiErrorModal = () => {
    setApiError("");
  };
  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    if (phone.length === 10 && phone.startsWith('0')) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const getLineUrl = (lineId) => {
    if (!lineId) return null;
    return `https://line.me/ti/p/~${lineId}`;
  };


  const hasContactInfo = user.phone || user.line;

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                📞 ข้อมูลการติดต่อ
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ข้อมูลที่ผู้สนใจประกาศสามารถติดต่อคุณได้
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
                    {isEditing ? (
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
              {/* Edit Form */}
              <TextInput
                id="phone"
                label="หมายเลขโทรศัพท์มือถือ"
                type="tel"
                disabled={isSaving}
                register={() =>
                  register("phone", {
                    required: "กรุณาระบุหมายเลขโทรศัพท์มือถือ",
                    pattern: MobilePhonePattern("หมายเลขโทรศัพท์มือถือ"),
                  })
                }
                unregister={unregister}
                error={errors.phone}
                placeholder="0812345678"
              />

              <TextInput
                id="line"
                label="ไลน์ไอดี"
                disabled={isSaving}
                register={() =>
                  register("line", {
                    required: "กรุณาระบุไลน์ไอดี",
                    pattern: LineIdPattern("ไลน์ไอดี"),
                  })
                }
                unregister={unregister}
                error={errors.line}
                placeholder="somchai149_property (ระบุเครื่องหมาย @ ถ้ามี)"
              />

              {/* Save/Cancel Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
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
          ) : (
            <>
              {hasContactInfo ? (
                <div className="space-y-4">
                  {/* Phone Number */}
                  {user.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        หมายเลขโทรศัพท์มือถือ
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatPhoneNumber(user.phone)}
                        </span>
                        <a
                          href={`tel:${user.phone}`}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          โทร
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Line ID */}
                  {user.line && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ไลน์ไอดี
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                        </svg>
                        <span className="text-sm text-gray-900">
                          {user.line}
                        </span>
                        <a
                          href={getLineUrl(user.line)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-500"
                        >
                          เปิด LINE
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-400">
                    <PhoneIcon className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    ยังไม่มีข้อมูลการติดต่อ
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    กรุณาเพิ่มข้อมูลการติดต่อเพื่อให้ผู้สนใจสามารถติดต่อคุณได้
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* API Error Modal */}
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

export default ContactInfoSection; 