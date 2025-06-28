import { useForm } from "react-hook-form";
import { CheckIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useRouter } from "next/router";
import TextInput from "../UI/Public/Inputs/TextInput";
import {
  maxLength,
  minLength,
  MobilePhonePattern,
  LineIdPattern,
} from "../../libs/form-validator";
import ProfileImageInput from "../UI/Public/Inputs/ProfileImageInput/ProfileImageInput";
import Button from "../UI/Public/Button";
import Modal from "../UI/Public/Modal";
import { updateUserProfile } from "../../libs/managers/userManager";
import { firebaseAuth } from "../../libs/firebase";

const ProfileSection = ({ userProfile }) => {
  const profileDefaultValues = {
    name: userProfile.name || "",
    phone: userProfile.phone || "",
    line: userProfile.line || "",
    profileImg: userProfile.profileImg || "",
  };

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, submitCount, isDirty },
  } = useForm({ defaultValues: profileDefaultValues });

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const submitHandler = async (data) => {
    try {
      console.log("Profile update initiated.");
      setSaving(true);
      await updateUserProfile(data, userProfile.id);
      const timer = setTimeout(() => {
        setShowSuccessModal(true);
        setSaving(false);
      }, 10000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Profile update failed:", error);
      setSaving(false);
    }
  };
  console.log("ProfileSection");

  const emailVerified = userProfile.emailVerified
    ? "ยืนยันแล้ว"
    : "ยังไม่ยืนยัน";

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                ข้อมูลสาธารณะ
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ข้อมูลเหล่านี้จะปรากฎในทุกประกาศของคุณ
                ช่วยให้ผู้สนใจประกาศติดต่อคุณได้ง่ายขึ้น
              </p>
            </div>

            <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="name"
                    label="ชื่อ"
                    register={() =>
                      register("name", {
                        required: "กรุณาระบุชื่อ",
                        minLength: { ...minLength(3, "ชื่อ") },
                        maxLength: { ...maxLength(30, "ชื่อ") },
                      })
                    }
                    unregister={unregister}
                    error={errors.name}
                    placeholder="ชื่อที่คุณต้องการให้แสดงบนประกาศ"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="email"
                    label="อีเมล"
                    value={userProfile.email}
                    tailingSlot={emailVerified}
                    disabled
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="phone"
                    label="หมายเลขโทรศัพท์มือถือ"
                    register={() =>
                      register("phone", {
                        required: "กรุณาระบุหมายเลขโทรศัพท์มือถือ",
                        pattern: MobilePhonePattern("หมายเลขโทรศัพท์มือถือ"),
                      })
                    }
                    unregister={unregister}
                    error={errors.phone}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <TextInput
                    id="line"
                    label="ไลน์ไอดี"
                    placeholder={"หากมีเครื่องหมาย @ ต้องระบุด้วย"}
                    register={() =>
                      register("line", {
                        required: "กรุณาระบุไลน์ไอดี",
                        pattern: LineIdPattern("ไลน์ไอดี"),
                      })
                    }
                    unregister={unregister}
                    error={errors.line}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <ProfileImageInput
                    id="profileImg"
                    label="รูปโพรไฟล์"
                    register={() =>
                      register("profileImg", {
                        required: "กรุณาอัพโหลดรูปโปรไฟล์",
                      })
                    }
                    originFileUrl={userProfile.profileImg}
                    unregister={unregister}
                    error={errors.profileImg}
                    setValue={setValue}
                  />
                </div>

                {/* Profile Section Button */}
                <div className="col-span-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={!isDirty || saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "กำลังบันทึก..." : "อัพเดทโปรไฟล์"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Modal
        visible={showSuccessModal}
        title="อัพเดทโปรไฟล์สำเร็จ"
        desc="ข้อมูลโปรไฟล์ของคุณได้รับการอัพเดทเรียบร้อย"
        buttonCaption="โอเค"
        Icon={CheckIcon}
        onClose={() => {
          firebaseAuth.currentUser.getIdTokenResult(true).then(() => {
            router.reload();
          });
        }}
      />
    </>
  );
};

export default ProfileSection;
