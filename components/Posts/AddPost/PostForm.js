import LocationSection from "./LocationSection";
import BasicSection from "./BasicSection";
import { useForm } from "react-hook-form";
import { addNewPost, updatePost } from "../../../libs/post-utils";
import MediaSection from "./MediaSection";
import Modal from "../../UI/Public/Modal";
import {
  CheckIcon,
  LockClosedIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../UI/Public/Button";
import { authContext } from "../../../contexts/authContext";
import AddDoc from "../../Icons/AddDoc";
import PageTitle from "../../UI/Private/PageTitle";
// import Banner from "../../Banner/Banner";
import ConfirmSection from "./ConfirmSection";
import Alert from "../../UI/Public/Alert";
import { getFacilityObject } from "../../../libs/mappers/facilityMapper";
import { getSpecsObject } from "../../../libs/mappers/specMapper";
import { getEditedFields } from "../../../libs/form-utils";

const PostForm = ({ postData }) => {
  // console.log("PostForm", postData);

  const isEditMode = !!postData;

  const defaultValues = isEditMode
    ? {
        // Required 10 fields excluded postNumber (Originally it's 11 required fields)
        title: postData.title,
        desc: postData.desc,
        assetType: postData.assetType,
        postType: postData.postType,
        price: postData.price,
        thumbnail: postData.thumbnail,
        images: postData.images,
        facilities: getFacilityObject(postData.facilities),
        specs: getSpecsObject(postData.specs),
        address: postData.address,

        // Optional 8 fields
        isStudio: postData.isStudio,
        land: postData.land,
        landUnit: postData.landUnit,
        area: postData.area,
        areaUnit: postData.areaUnit,
        priceUnit: postData.priceUnit,
        condition: postData.condition,
        refId: postData.refId,
      }
    : {};

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, submitCount, dirtyFields, isDirty },
  } = useForm({ defaultValues: defaultValues });

  const router = useRouter();
  const { user, isAgent, isProfileComplete } = useContext(authContext);

  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [warningMessages, setWarningMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const modalSuccessTitle = isEditMode
    ? "อัพเดทประกาศสำเร็จ"
    : "สร้างประกาศสำเร็จ";
  const modalSuccessMessage = isEditMode
    ? "ประกาศของคุณได้รับการอัพเดทเรียบร้อยแล้ว"
    : "ประกาศของคุณได้รับการเผยแพร่เป็นสาธารณะแล้ว และจะปรากฏบนหน้าแรกใน 30 นาที";

  const modeLabel = isEditMode
    ? `แก้ไขประกาศ #${postData.postNumber}`
    : "ลงประกาศ";
  const pageTitle =
    modeLabel + (isAgent ? ` (เอเจ้นท์)` : " (ผู้ใช้งานทั่วไป)");

  const allowCreatePost = isAgent ? isProfileComplete : true;

  const formDataChanged = isDirty && Object.entries(dirtyFields).length > 0;

  const submitHandler = async (formData) => {
    setSaving(true);

    try {
      if (isEditMode) {
        //UPDATE MODE
        const editedData = getEditedFields(dirtyFields, formData);
        const result = await updatePost(postData._id, editedData);
        console.log("Post updated successfully", result);
      } else {
        // CREATE MODE
        const result = await addNewPost(formData);
        console.log("Post created successfully", result);
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error(`${isEditMode ? "Edit" : "Create"} post failed:`, error);
      setErrorMessage(
        "เกิดข้อผิดพลาดในการบันทึกประกาศ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง"
      );

      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      const messages = [];
      if (!user.emailVerified) {
        messages.push(
          `เราส่งลิ้งค์ยืนยันอีเมลไปที่ ${user.email} กรุณายืนยันว่าคุณเป็นเจ้าของอีเมล`
        );
      }
      if (!isProfileComplete) {
        messages.push(
          "กรุณากำหนดชื่อ รูปภาพโปรไฟล์ หมายเลขโทรศัพท์และไลน์ไอดี เพื่อให้ผู้เข้าชมประกาศสามารถติดต่อคุณได้"
        );
      }
      setWarningMessages(messages);
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle
        label={modeLabel}
        leadingSlot={<AddDoc className="text-gray-500 w-8 h-8" />}
      />

      <form
        className="space-y-6 relative"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Profile warning messages */}
        {warningMessages.length > 0 && (
          <div className="animate-pulse">
            <Alert
              alertTitle="ก่อนลงประกาศกรุณาดำเนินการต่อไปนี้:"
              messages={warningMessages}
              showButton={true}
              buttonLabel={"ไปที่โปรไฟล์"}
              onClick={() => {
                router.push("/profile");
              }}
            />

            <div className="absolute bg-black bg-opacity-5 w-full h-full z-40">
              <LockClosedIcon
                className="h-20 w-20 md:h-40 md:w-40 flex-shrink-0 text-gray-500 m-auto mt-20 md:mt-40"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Main basic section */}
        <BasicSection
          register={register}
          unregister={unregister}
          watch={watch}
          setValue={setValue}
          errors={errors}
          isEditMode={isEditMode}
          defaultValues={defaultValues}
        />

        {!isEditMode && (
          <MediaSection
            register={register}
            unregister={unregister}
            watch={watch}
            setValue={setValue}
            errors={errors}
            submitCount={submitCount}
          />
        )}

        {!isEditMode && (
          <LocationSection
            register={register}
            unregister={unregister}
            watch={watch}
            setValue={setValue}
            setFocus={setFocus}
            errors={errors}
            submitCount={submitCount}
            isEditMode={isEditMode}
            defaultValues={defaultValues}
          />
        )}

        {/* Confirm Post Creation Section*/}
        {!isEditMode && (
          <ConfirmSection
            register={register}
            unregister={unregister}
            watch={watch}
            setValue={setValue}
            setFocus={setFocus}
            errors={errors}
            submitCount={submitCount}
          />
        )}

        {/* Post Success Modal */}
        <Modal
          visible={showSuccessModal}
          title={modalSuccessTitle}
          desc={modalSuccessMessage}
          buttonCaption="ไปยังประกาศ"
          Icon={CheckIcon}
          onClose={() => {
            setShowSuccessModal(false);
            router.push(`/account/posts/${postData._id}`);
          }}
        />

        {/* Error Modal */}
        <Modal
          visible={showErrorModal}
          type="warning"
          title="เกิดข้อผิดพลาด"
          desc={errorMessage}
          buttonCaption="ตกลง"
          Icon={ExclamationIcon}
          onClose={() => {
            setShowErrorModal(false);
            setErrorMessage("");
          }}
        />

        {/* Footer Buttons */}
        {allowCreatePost && (
          <div className="flex-row md:flex md:justify-between md:flex-row-reverse md:gap-4 md:w-60 md:ml-auto">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={isEditMode && !formDataChanged}
            >
              บันทึก
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              ยกเลิก
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;
