import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "../../components/UI/Public/Modal";
import { verifyEmail } from "../../libs/managers/authManager";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { genPageTitle } from "../../libs/seo-utils";
import Head from "next/head";
import Loader from "../../components/UI/Common/modals/Loader";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { email, vtoken } = router.query;
  const [verificationMessage, setVerificationMessage] = useState("");

  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email && vtoken) {
      verifyEmail({ email, vToken: vtoken })
        .then((result) => {
          console.log(result);
          setVerificationMessage("อีเมลของคุณได้รับการยืนยันเรียบร้อย");
        })
        .catch((ex) => {
          console.error(ex);
          setVerificationMessage("ลิ้งค์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ");
          setIsError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [email, vtoken]);

  const modalTitle = isError ? "เกิดข้อผิดพลาด" : "ยืนยันอีเมลสำเร็จ";
  const modalType = isError ? "warning" : "success";
  const modalIcon = isError ? ExclamationCircleIcon : CheckIcon;
  const modalButtonLabel = isError ? "กลับหน้าแรก" : "ไปหน้าโปรไฟล์";

  const onPressModalButton = () => {
    if (window) {
      window.location = isError ? "/" : "/profile";
    }
  };

  return (
    <>
      <Head>
        <title>{genPageTitle("ยืนยันอีเมล")}</title>
      </Head>
      {loading && <Loader />}
      {!loading && (
        <Modal
          visible={true}
          type={modalType}
          title={modalTitle}
          desc={verificationMessage}
          buttonCaption={modalButtonLabel}
          Icon={modalIcon}
          onClose={onPressModalButton}
        />
      )}
    </>
  );
};

export default VerifyEmailPage;
