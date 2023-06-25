import { useContext, useState } from "react";
import Button from "../../UI/Public/Button";
import { CheckIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Confirm from "../../UI/Public/Modals/Confirm";
import { deactivatePost } from "../../../libs/post-utils";
import { authContext } from "../../../contexts/authContext";
import Modal from "../../UI/Public/Modal";

const PostActionConsole = ({ postId, postSlug, postStatus }) => {
  const router = useRouter();
  const { user } = useContext(authContext);

  const [saving, setSaving] = useState(false);
  const [showDeactivePostConfirmModal, setShowDeactivePostConfirmModal] =
    useState(false);
  const [showDeactivateResultModal, setShowDeactivateResultModal] =
    useState(false);

  const deactivePostHandler = () => {
    setSaving(true);
    deactivatePost(postId, user)
      .then((result) => {
        debugger;
        console.log(result);
        setShowDeactivateResultModal(true);
        setSaving(false);
      })
      .catch((error) => {
        debugger;
        console.error(error);
      });
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
              window.open(`/agent/post/edit/${postId}`);
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
            loading={saving}
            onClick={() => {
              setShowDeactivePostConfirmModal(true);
            }}
          >
            ปิดประกาศ
          </Button>
        )}
      </div>

      <Modal
        visible={showDeactivateResultModal}
        title="ปิดประกาศสำเร็จ"
        desc="ประกาศของคุณถูกปิดใช้งานเรียบร้อยแล้ว และจะถูกนำออกจากหน้าแรกใน 30 นาที"
        buttonCaption="กลับหน้าแรก"
        Icon={CheckIcon}
        onClose={() => {
          router.reload();
        }}
      />

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
    </div>
  );
};

export default PostActionConsole;
