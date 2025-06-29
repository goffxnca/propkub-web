import { CheckCircleIcon, ExclamationCircleIcon, PencilIcon, CheckIcon, XIcon, ExclamationIcon } from "@heroicons/react/outline";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "../../lib/api/client";
import { authContext } from "../../contexts/authContext";
import { minLength, maxLength } from "../../libs/form-validator";
import TextInput from "../UI/Public/Inputs/TextInput";
import Modal from "../UI/Public/Modal";
import { getThaiFullDateTimeString } from "../../libs/date-utils";
import ProfileImageInput from "./ProfileImageInput";
import { uploadFileToStorage } from "../../libs/utils/file-utils";

const PersonalInfoSection = ({ user }) => {
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
      name: user.name || "",
      profileImg: user.profileImg || ""
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setApiError("");
    reset({
      name: user.name || "",
      profileImg: user.profileImg || ""
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiError("");
    reset({
      name: user.name || "",
      profileImg: user.profileImg || ""
    });
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setApiError("");
    
    try {
      console.log("Saving personal info:", formData);
      
      // Prepare final data
      const finalData = { name: formData.name };
      
      // Check if profile image was changed
      if (formData.profileImg?.changed) {
        console.log("Uploading new profile image...");
        
        // Upload to Firebase Storage
        const imageUrl = await uploadFileToStorage(
          "us", 
          user._id, 
          formData.profileImg.file
        );
        
        if (!imageUrl) {
          throw new Error("ไม่สามารถอัพโหลดรูปโปรไฟล์ได้");
        }
        
        finalData.profileImg = imageUrl;
        console.log("Profile image uploaded successfully:", imageUrl);
      }
      
      // Send to NestJS backend
      const updatedUser = await apiClient.auth.updateProfile(finalData);
      
      // Update state
      setUser(updatedUser);
      setIsEditing(false);
      
      console.log("Personal info saved successfully!");
      
    } catch (error) {
      console.error("Failed to save personal info:", error);
      setApiError(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseApiErrorModal = () => {
    setApiError("");
  };

  const getVerificationStatus = () => {
    if (user.emailVerified) {
      return {
        text: "ยืนยันแล้ว",
        icon: CheckCircleIcon,
        color: "text-green-600",
        bgColor: "bg-green-100"
      };
    } else {
      return {
        text: "ยังไม่ยืนยัน",
        icon: ExclamationCircleIcon,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100"
      };
    }
  };

  const getRoleBadge = () => {
    if (user.role === 'agent') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          นายหน้าอสังหาริมทรัพย์
        </span>
      );
    }
    return null;
  };

  const getProviderInfo = (provider) => {
    switch (provider) {
      case 'EMAIL':
        return { icon: '✉️', name: 'อีเมล' };
      case 'GOOGLE':
        return { icon: '🔍', name: 'Google' };
      case 'FACEBOOK':
        return { icon: '📘', name: 'Facebook' };
      default:
        return { icon: '✉️', name: 'อีเมล' };
    }
  };

  const verification = getVerificationStatus();
  const VerificationIcon = verification.icon;

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                🧑‍💼 ข้อมูลส่วนตัว
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ข้อมูลพื้นฐานของคุณที่แสดงในระบบ
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
          <div className="space-y-6">
            {/* Profile Image and Name Row */}
            <div className="flex items-center space-x-6">
              {isEditing ? (
                <form onSubmit={handleSubmit(handleSave)} className="w-full">
                  <div className="space-y-4">
                    {/* Profile Image Input */}
                    <ProfileImageInput
                      id="profileImg"
                      label="รูปโปรไฟล์"
                      register={() => register("profileImg")}
                      originFileUrl={user.profileImg}
                      unregister={unregister}
                      error={errors.profileImg}
                      setValue={setValue}
                      disabled={isSaving}
                    />

                    {/* Name Input */}
                    <TextInput
                      id="name"
                      label="ชื่อ"
                      register={() =>
                        register("name", {
                          required: "กรุณาระบุชื่อ",
                          minLength: { ...minLength(5, "ชื่อ") },
                          maxLength: { ...maxLength(30, "ชื่อ") },
                        })
                      }
                      unregister={unregister}
                      error={errors.name}
                      placeholder="ระบุชื่อของคุณ"
                      disabled={isSaving}
                    />

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
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
                  </div>
                </form>
              ) : (
                <>
                  <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
                    <img
                      src={user.profileImg || "/user.png"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                      {getRoleBadge()}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Email and Verification */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <span className="text-sm text-gray-900">{user.email}</span>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verification.bgColor} ${verification.color}`}>
                    <VerificationIcon className="w-3 h-3 mr-1" />
                    {verification.text}
                  </div>
                </div>
              </div>

              {/* Last Login */}
              {user.lastLoginAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    เข้าสู่ระบบครั้งล่าสุด
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-sm text-gray-900">
                      {getThaiFullDateTimeString(user.lastLoginAt)}
                    </span>
                    <span className="text-sm text-gray-500">ผ่าน</span>
                    <div className="inline-flex items-center">
                      <span className="text-sm mr-1">
                        {getProviderInfo(user.lastLoginProvider).icon}
                      </span>
                      <span className="text-sm text-gray-900">
                        {getProviderInfo(user.lastLoginProvider).name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              {user.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    อัพเดทล่าสุด
                  </label>
                  <div className="mt-1">
                    <span className="text-sm text-gray-900">
                      {getThaiFullDateTimeString(user.updatedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

export default PersonalInfoSection; 