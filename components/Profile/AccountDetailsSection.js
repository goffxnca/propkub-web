import { CalendarIcon, LoginIcon, MailIcon } from "@heroicons/react/outline";
import { getThaiFullDateTimeString } from "../../libs/date-utils";
import GoogleIcon from "../Icons/GoogleIcon";
import FacebookIcon from "../Icons/FacebookIcon";

const AccountDetailsSection = ({ user }) => {
  const getProviderDisplay = (provider) => {
    const providerMap = {
      email: {
        name: "อีเมล",
        icon: <MailIcon className="w-4 h-4 text-gray-600" />,
        color: "text-gray-600",
      },
      google: {
        name: "Google",
        icon: <GoogleIcon />,
        color: "text-blue-600",
      },
      facebook: {
        name: "Facebook",
        icon: <FacebookIcon className="text-blue-600" />,
        color: "text-blue-800",
      },
    };
    return (
      providerMap[provider] || {
        name: provider,
        icon: "🔗",
        color: "text-gray-600",
      }
    );
  };

  const getLoginProviderInfo = (provider) => {
    if (!provider)
      return {
        icon: <MailIcon className="w-4 h-4 text-gray-600" />,
        name: "อีเมล",
      };

    const normalizedProvider = provider.toLowerCase();
    switch (normalizedProvider) {
      case "email":
        return {
          icon: <MailIcon className="w-4 h-4 text-gray-600" />,
          name: "อีเมล",
        };
      case "google":
        return {
          icon: <GoogleIcon />,
          name: "Google",
        };
      case "facebook":
        return {
          icon: <FacebookIcon className="text-blue-600" />,
          name: "Facebook",
        };
      default:
        return {
          icon: <MailIcon className="w-4 h-4 text-gray-600" />,
          name: "อีเมล",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "ไม่ระบุ";
    }
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        return "วันนี้";
      } else if (diffInDays === 1) {
        return "เมื่อวาน";
      } else if (diffInDays < 7) {
        return `${diffInDays} วันที่แล้ว`;
      } else {
        return date.toLocaleDateString("th-TH");
      }
    } catch (error) {
      return "ไม่ระบุ";
    }
  };

  const providerInfo = getProviderDisplay(user.provider);
  const lastLoginProviderInfo = user.lastLoginProvider
    ? getProviderDisplay(user.lastLoginProvider)
    : null;

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            👤 ข้อมูลบัญชีผู้ใช้
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            ข้อมูลเกี่ยวกับสถานะและประวัติการใช้งานบัญชี
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-4">
            {/* Account Registration Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                สมัครสมาชิกด้วย
              </label>
              <div className="mt-1 flex items-center space-x-2">
                {providerInfo.icon}
                <span className={`text-sm font-medium ${providerInfo.color}`}>
                  {providerInfo.name}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                สมาชิกตั้งแต่
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            {/* User ID */}
            {user.cid && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  หมายเลขสมาชิก
                </label>
                <div className="mt-1">
                  <span className="text-sm text-gray-900 font-mono">
                    #{user.cid}
                  </span>
                </div>
              </div>
            )}

            {/* Last Login */}
            {user.lastLoginAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เข้าสู่ระบบครั้งล่าสุด
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <LoginIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {getThaiFullDateTimeString(user.lastLoginAt)}
                  </span>
                  <span className="text-sm text-gray-500">ผ่าน</span>
                  <div className="inline-flex items-center">
                    <span className="text-sm text-gray-900">
                      {getLoginProviderInfo(user.lastLoginProvider).name}
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
                <div className="mt-1 flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {getThaiFullDateTimeString(user.updatedAt)}
                  </span>
                </div>
              </div>
            )}

            {/* Terms of Service */}
            {user.tos && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ข้อกำหนดการใช้งาน
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm text-green-600">✓ ยอมรับแล้ว</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsSection;
