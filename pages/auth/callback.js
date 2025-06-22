import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { authContext } from "../../contexts/authContext";
import { tokenManager } from "../../lib/api/tokenManager";
import { apiClient } from "../../lib/api/client";
import { ExclamationIcon } from "@heroicons/react/outline";
import Loader from "../../components/UI/Common/modals/Loader";
import Modal from "../../components/UI/Public/Modal";

const AuthCallback = () => {
  const router = useRouter();
  const { setUser } = useContext(authContext);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("[AuthCallback] Processing OAuth callback...");
        const { token, error } = router.query;

        if (error || !token) {
          console.error("[AuthCallback] OAuth error:", error);
          setIsProcessing(false);
          setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          return;
        }

        console.log("[AuthCallback] Login successful:", { accessToken: token });

        tokenManager.setToken(token);
        const userProfile = await apiClient.auth.getProfile();
        console.log(
          "[AuthCallback] User profile fetched after social login:",
          userProfile
        );
        setUser(userProfile);
        router.push("/profile");
      } catch (error) {
        console.error("[AuthCallback] Error processing callback:", error);
        tokenManager.removeToken();
        setUser(null);
        setIsProcessing(false);
        setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query, router, setUser]);

  const handleCloseErrorModal = () => {
    router.push("/login");
  };

  return (
    <>
      {isProcessing && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-gray-600">กำลังเข้าสู่ระบบ...</p>
          </div>
        </div>
      )}

      <Modal
        visible={!!error}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={error}
        buttonCaption="ตกลง"
        onClose={handleCloseErrorModal}
      />
    </>
  );
};

export default AuthCallback;
