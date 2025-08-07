import { useState } from "react";
import Button from "../../UI/Public/Button";
import { CheckIcon, ExclamationIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Confirm from "../../UI/Public/Modals/Confirm";
import Modal from "../../UI/Public/Modal";
import { apiClient } from "../../../libs/client";

const PostActionConsole = ({ postId, postSlug, postStatus }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const closePostHandler = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      await apiClient.posts.closePost(postId);
      setShowSuccessModal(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to close post:", error);
      setLoading(false);
      setErrorMessage("เกิดข้อผิดพลาดในการปิดประกาศ กรุณาลองใหม่อีกครั้ง");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-4 min-h-[100px]">
      <h3 className="text-lg font-medium leading-6 text-gray-900"></h3>
      <div className="grid grid-cols-2 gap-x-2">
        {postStatus === "active" && (
          <Button
            variant="primary"
            loading={false}
            onClick={() => {
              router.push(`/account/posts/edit/${postId}`);
            }}
          >
            แก้ไขประกาศ
          </Button>
        )}

        <Button
          variant="primary"
          loading={false}
          onClick={() => {
            window.open(`/property/${postSlug}`);
          }}
        >
          แสดงประกาศ
        </Button>
        {postStatus === "active" && (
          <Button
            variant="accent"
            loading={loading}
            onClick={() => {
              setShowConfirmModal(true);
            }}
          >
            ปิดประกาศ
          </Button>
        )}
      </div>

      <Modal
        visible={showSuccessModal}
        title="ปิดประกาศสำเร็จ"
        desc="ประกาศของคุณถูกปิดใช้งานเรียบร้อยแล้ว และจะถูกนำออกจากหน้าแรกใน 30 นาที"
        buttonCaption="กลับหน้าแรก"
        Icon={CheckIcon}
        onClose={() => {
          router.reload();
        }}
      />

      <Confirm
        visible={showConfirmModal}
        title="ปิดประกาศ"
        desc="คุณยืนยันว่าคุณต้องการปิดประกาศนี้ใช่หรือไม่?"
        onConfirm={closePostHandler}
        onClose={() => {
          setShowConfirmModal(false);
        }}
      />

      <Modal
        visible={showErrorModal}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={errorMessage}
        buttonCaption="ตกลง"
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage("");
        }}
      />
    </div>
  );
};

export default PostActionConsole;
