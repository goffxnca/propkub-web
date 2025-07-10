import LocationSection from "./LocationSection";
import BasicSection from "./BasicSection";
import { useForm } from "react-hook-form";
import {
  addNewPost,
  updatePost,
  deactivatePost,
  addNewPost2,
} from "../../../libs/post-utils";
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
import Confirm from "../../UI/Public/Modals/Confirm";
import Alert from "../../UI/Public/Alert";

const AddPostForm = ({ postData }) => {
  console.log("PostForm");
  // console.log("postData", postData);

  const isEditMode = !!postData;

  const defaultValues = isEditMode
    ? {
        title: postData.title,
        desc: postData.desc,
        assetType: postData.assetType,
        postType: postData.postType,
        price: postData.price,
        isStudio: postData.isStudio,
        facilities: postData.facilities.reduce(
          (a, v) => ({ ...a, [v.id]: true }),
          {}
        ),
        specs: {
          beds: postData.specs.find((s) => s.id === "beds")?.value || 0,
          baths: postData.specs.find((s) => s.id === "baths")?.value || 0,
          kitchens: postData.specs.find((s) => s.id === "kitchens")?.value || 0,
          parkings: postData.specs.find((s) => s.id === "parkings")?.value || 0,
        },
        address: {
          //atm, edit mode we dont allow to edit location stuff, too much too handle!
          regionId: "r2",
          provinceId: "p2",
          districtId: "d1106",
          subDistrictId: "s110602",
          location: { lat: 13.8110162, lng: 100.5709232 },
        },
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
    formState: { errors, submitCount },
  } = useForm({ defaultValues: defaultValues });

  const router = useRouter();
  const { user, isAgent, isProfileComplete } = useContext(authContext);

  const [saving, setSaving] = useState(false);
  const [postSlug, setPostSlug] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeactivePostConfirmModal, setShowDeactivePostConfirmModal] =
    useState(false);
  const [showDeactivateResultModal, setShowDeactivateResultModal] =
    useState(false);
  const [warningMessages, setWarningMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const modalSuccessTitle = isEditMode
    ? "อัพเดทประกาศสำเร็จ"
    : "สร้างประกาศสำเร็จ";
  const modalSuccessMessage = isEditMode
    ? "ประกาศของคุณได้รับการอัพเดทเรียบร้อยแล้ว"
    : "ประกาศของคุณได้รับการเผยแพร่เป็นสาธารณะแล้ว และจะปรากฏบนหน้าแรกใน 30 นาที";

  const modeLabel = isEditMode ? "แก้ไขประกาศ" : "ลงประกาศ";
  const pageTitle =
    modeLabel + (isAgent ? ` (เอเจ้นท์)` : " (ผู้ใช้งานทั่วไป)");

  const allowCreatePost = isAgent ? isProfileComplete : true;

  const submitHandler = async (data) => {
    console.log("Raw FormData", data);
    setSaving(true);

    try {
      if (isEditMode) {
        //UPDATE MODE
        const result = await updatePost(postData.id, data, user);
        console.log(result);
        setPostSlug(postData.slug);
        setShowSuccessModal(true);
        setSaving(false);
      } else {
        // CREATE MODE
        //We also want to save the name of province, district, subDistrict to db right away not just ids, so they can be ready to use in next fetch,
        //but the SelectInput component now track only ids and no display name(label) that's why we need to manually grab it here.
        //TODO: Change SelectInput component to track both values&display labels
        //Note: these workaround codes below is quite silly btw.
        const provinceElem = document.getElementById("address.provinceId");
        const provinceLabel = provinceElem.item(
          provinceElem.selectedIndex
        ).label;

        const districtElem = document.getElementById("address.districtId");
        const districtLabel = districtElem.item(
          districtElem.selectedIndex
        ).label;

        const subDistrictElem = document.getElementById(
          "address.subDistrictId"
        );
        const subDistrictLabel = subDistrictElem.item(
          subDistrictElem.selectedIndex
        ).label;

        const formData = {
          ...data,
          address: {
            ...data.address,
            provinceLabel,
            districtLabel,
            subDistrictLabel,
          },
        };

        console.log("Adjusted FormData", formData);
        console.log(
          "Adjusted FormData (Stringified)",
          JSON.stringify(formData)
        );

        const result = await addNewPost2(formData, user);
        console.log("post success", result);
        setPostSlug(result.slug);
        setShowSuccessModal(true);
        setSaving(false);
      }
    } catch (error) {
      console.error("Post creation/update error:", error);
      setErrorMessage(
        "เกิดข้อผิดพลาดในการสร้างประกาศ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง"
      );

      setSaving(false);
      setShowErrorModal(true);
    }
  };

  const deactivePostHandler = () => {
    setSaving(true);
    deactivatePost(postData.id, user)
      .then((result) => {
        console.log(result);
        setShowDeactivateResultModal(true);
        setSaving(false);
      })
      .catch((error) => {
        console.error(error);
      });
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
          "กรุณาอัพเดทโปรไฟล์ของคุณให้เรียบร้อย เพื่อให้ผู้เข้าชมประกาศสามารถติดต่อคุณได้"
        );
      }
      setWarningMessages(messages);
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle
        label={pageTitle}
        leadingSlot={<AddDoc className="text-gray-500 w-8 h-8" />}
      />

      <form
        className="space-y-6 relative"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Profile warning messages */}
        {warningMessages.length > 0 && (
          <>
            <Alert
              alertTitle="ก่อนลงประกาศกรุณาดำเนินการต่อไปนี้:"
              messages={warningMessages}
              showButton={true}
              buttonLabel={"ตรวจสอบอีกครั้ง"}
              onClick={() => {
                router.reload();
              }}
            />

            <div className="absolute bg-black bg-opacity-5 w-full h-full z-40">
              <LockClosedIcon
                className="h-20 w-20 md:h-40 md:w-40 flex-shrink-0 text-gray-500 m-auto mt-20 md:mt-40"
                aria-hidden="true"
              />
            </div>
          </>
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

        {/* Allow setting images/medias only in Create Mode */}
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

        {/* Allow setting locations only in Create Mode */}
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
        <ConfirmSection
          register={register}
          unregister={unregister}
          watch={watch}
          setValue={setValue}
          setFocus={setFocus}
          errors={errors}
          submitCount={submitCount}
        />

        {/* Post Success Modal */}
        <Modal
          visible={showSuccessModal}
          title={modalSuccessTitle}
          desc={modalSuccessMessage}
          buttonCaption="ไปยังประกาศ"
          Icon={CheckIcon}
          onClose={() => {
            setShowSuccessModal(false);
            // router.push(postSlug ? `/property/${postSlug}` : "/");
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

        {/* Deactive Success Modal */}
        <Modal
          visible={showDeactivateResultModal}
          title="ปิดประกาศสำเร็จ"
          desc="ประกาศของคุณถูกปิดใช้งานเรียบร้อยแล้ว และจะถูกนำออกจากหน้าแรกใน 30 นาที"
          buttonCaption="กลับหน้าแรก"
          Icon={CheckIcon}
          onClose={() => {
            router.push("/");
          }}
        />

        {/* Confirm Post Deactivation */}
        <Confirm
          visible={showDeactivePostConfirmModal}
          title="ปิดประกาศ"
          desc="คุณยืนยันว่าคุณต้องการปิดประกาศนี้ใช่หรือไม่?"
          // Icon={LocationMarkerIcon}
          onConfirm={deactivePostHandler}
          onClose={() => {
            setShowDeactivePostConfirmModal(false);
          }}
        />

        {/* Footer Buttons */}
        {allowCreatePost && (
          <div className="flex-row md:flex md:justify-between md:flex-row-reverse md:gap-4 md:w-60 md:ml-auto">
            <Button type="submit" variant="primary" loading={saving}>
              บันทึก
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="accent"
                onClick={() => {
                  setShowDeactivePostConfirmModal(true);
                }}
              >
                ปิดประกาศ
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => {
                router.push("/");
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

export default AddPostForm;
