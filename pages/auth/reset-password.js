import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/UI/Public/Modal";
import { apiClient } from "../../lib/api/client";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { genPageTitle } from "../../libs/seo-utils";
import Head from "next/head";
import Loader from "../../components/UI/Common/modals/Loader";
import TextInput from "../../components/UI/Public/Inputs/TextInput";
import Button from "../../components/UI/Public/Button";
import { minLength, maxLength } from "../../libs/form-validator";
import { t } from "../../libs/translator";
import GuestOnlyRoute from "../../components/Auth/GuestOnlyRoute";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(null);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          await apiClient.auth.validateResetToken(token);
          setTokenValid(true);
        } catch (err) {
          setTokenValid(false);
          const errorMessage = t(err.message);
          setError(errorMessage);
        }
      } else if (router.isReady && !token) {
        setTokenValid(false);
        setError("ลิ้งค์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ");
      }
    };

    validateToken();
  }, [token, router.isReady]);

  const submitHandler = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      await apiClient.auth.resetPassword(token, data.newPassword);
      setSuccess(true);
    } catch (err) {
      const errorMessage = t(err.message) || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      router.push("/login");
    } else {
      router.push("/");
    }
  };

  return (
    <GuestOnlyRoute>
      {/* Show loader while checking token */}
      {tokenValid === null && (
        <>
          <Head>
            <title>{genPageTitle("รีเซ็ตรหัสผ่าน")}</title>
          </Head>
          <Loader />
        </>
      )}

      {/* Show success modal */}
      {success && (
        <>
          <Head>
            <title>{genPageTitle("รีเซ็ตรหัสผ่าน")}</title>
          </Head>
          <Modal
            visible={true}
            type="success"
            title="รีเซ็ตรหัสผ่านสำเร็จ"
            desc="รหัสผ่านของคุณได้รับการรีเซ็ตเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที"
            buttonCaption="ไปหน้าล็อกอิน"
            Icon={CheckIcon}
            onClose={handleClose}
          />
        </>
      )}

      {/* Show error modal for invalid token */}
      {(!tokenValid || error) && !success && tokenValid !== null && (
        <>
          <Head>
            <title>{genPageTitle("รีเซ็ตรหัสผ่าน")}</title>
          </Head>
          <Modal
            visible={true}
            type="warning"
            title="เกิดข้อผิดพลาด"
            desc={error}
            buttonCaption="กลับหน้าแรก"
            Icon={ExclamationCircleIcon}
            onClose={handleClose}
          />
        </>
      )}

      {/* Show reset password form */}
      {tokenValid && !success && (
        <>
          <Head>
            <title>{genPageTitle("รีเซ็ตรหัสผ่าน")}</title>
          </Head>
          
          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">
                รีเซ็ตรหัสผ่าน
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                กรุณาใส่รหัสผ่านใหม่ของคุณ
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 mx-2">
                
                <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
                  <TextInput
                    id="newPassword"
                    label="รหัสผ่านใหม่"
                    type="password"
                    register={() =>
                      register("newPassword", {
                        required: "กรุณาระบุรหัสผ่านใหม่",
                        minLength: { ...minLength(6, "รหัสผ่าน") },
                        maxLength: { ...maxLength(64, "รหัสผ่าน") },
                      })
                    }
                    unregister={unregister}
                    error={errors.newPassword}
                  />

                  <TextInput
                    id="confirmPassword"
                    label="ยืนยันรหัสผ่านใหม่"
                    type="password"
                    register={() =>
                      register("confirmPassword", {
                        required: "กรุณายืนยันรหัสผ่านใหม่",
                        validate: (value, { newPassword }) =>
                          value === newPassword || "รหัสผ่านไม่ตรงกัน",
                      })
                    }
                    unregister={unregister}
                    error={errors.confirmPassword}
                  />

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-red-800">{error}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Button type="submit" variant="primary" loading={loading}>
                      รีเซ็ตรหัสผ่าน
                    </Button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </>
      )}
    </GuestOnlyRoute>
  );
};

export default ResetPasswordPage; 