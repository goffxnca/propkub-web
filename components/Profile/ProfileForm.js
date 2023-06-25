import { useForm } from "react-hook-form";
import { CheckIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "../UI/Public/Button";
import Modal from "../UI/Public/Modal";
import PageTitle from "../UI/Private/PageTitle";
import ProfileSection from "./ProfileSection";
import { updateUserProfile } from "../../libs/managers/userManager";
// import Banner from "../Banner/Banner";
import { firebaseAuth } from "../../libs/firebase";
import { authContext } from "../../contexts/authContext";
import Alert2 from "../UI/Public/Alert2";

const ProfileForm = ({ profile }) => {
  console.log("ProfileForm");

  const profileDefaultValues = {
    name: profile.name || "",
    phone: profile.phone || "",
    line: profile.line || "",
    profileImg: profile.profileImg || "",
  };

  const { isProfileComplete } = useContext(authContext);

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
  const [warningMessages, setWarningMessages] = useState([]);

  const submitHandler = (data) => {
    setSaving(true);
    updateUserProfile(data, profile.id)
      .then(() => {
        const timer = setTimeout(() => {
          setShowSuccessModal(true);
          setSaving(false);
          clearTimeout(timer);
        }, 10000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const messages = [];
    if (!profile.emailVerified) {
      messages.push(
        `เราส่งลิ้งค์ยืนยันอีเมลไปที่ ${profile.email} กรุณายืนยันว่าคุณเป็นเจ้าของอีเมล`
      );
    }
    if (!isProfileComplete) {
      messages.push(
        "กรุณาอัพเดทโปรไฟล์ของคุณให้เรียบร้อย เพื่อให้ผู้เข้าชมประกาศสามารถติดต่อคุณได้"
      );
    }
    setWarningMessages(messages);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle label="โปรไฟล์ของฉัน" />
      <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
        {warningMessages.length > 0 && (
          <Alert2
            alertTitle="ก่อนลงประกาศกรุณาดำเนินการต่อไปนี้:"
            messages={warningMessages}
            showButton={true}
            buttonLabel={"ตรวจสอบอีกครั้ง"}
            onClick={() => {
              router.reload();
            }}
          />
        )}

        {/* {!isProfileComplete && (
          <Banner
            message={
              "กรุณาอัพเดทโปรไฟล์ของคุณให้เรียบร้อย ก่อนลงประกาศ เพื่อให้ผู้เข้าชมประกาศสามารถติดต่อคุณได้"
            }
            // onClose={closeHeaderBannerHandler}
          />
        )} */}

        <ProfileSection
          userProfile={profile}
          register={register}
          unregister={unregister}
          watch={watch}
          setValue={setValue}
          submitCoun={submitCount}
          errors={errors}
        />

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

        {/* <SettingSection /> */}

        <div className="flex-row md:flex md:justify-between md:flex-row-reverse md:gap-4 md:w-60 md:ml-auto">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={!isDirty}
          >
            อัพเดท
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/");
            }}
          >
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
