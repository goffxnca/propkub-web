import { ShieldCheckIcon, KeyIcon, ExclamationIcon } from "@heroicons/react/outline";

const AccountSecuritySection = ({ user }) => {
  const getPasswordStatus = () => {
    // Users who signed up with email have passwords
    if (user.provider === 'email') {
      return {
        hasPassword: true,
        canChangePassword: true,
        message: 'คุณสามารถเปลี่ยนรหัสผ่านได้'
      };
    } else {
      // Users who signed up with Google/Facebook don't have passwords
      return {
        hasPassword: false,
        canChangePassword: false,
        message: `คุณเข้าสู่ระบบด้วย ${user.provider === 'google' ? 'Google' : 'Facebook'} ไม่จำเป็นต้องมีรหัสผ่าน`
      };
    }
  };

  const passwordStatus = getPasswordStatus();

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            🔐 ความปลอดภัยบัญชี
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            จัดการความปลอดภัยและการเข้าถึงบัญชีของคุณ
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {/* Password Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <div className="mt-1">
                {passwordStatus.hasPassword ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          รหัสผ่านได้รับการตั้งค่าแล้ว
                        </p>
                        <p className="text-sm text-green-600">
                          {passwordStatus.message}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <KeyIcon className="w-4 h-4 mr-2" />
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ExclamationIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          ไม่มีรหัสผ่าน
                        </p>
                        <p className="text-sm text-blue-600">
                          {passwordStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                เคล็ดลับความปลอดภัย
              </label>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm text-gray-700">
                    อีเมลของคุณ{user.emailVerified ? 'ได้รับการยืนยันแล้ว' : 'ยังไม่ได้รับการยืนยัน'}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm text-gray-700">
                    คุณเข้าสู่ระบบด้วย {user.provider === 'email' ? 'อีเมลและรหัสผ่าน' : user.provider === 'google' ? 'Google' : 'Facebook'} ที่ปลอดภัย
                  </span>
                </div>
                {user.provider === 'email' && (
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 text-sm">!</span>
                    <span className="text-sm text-gray-700">
                      แนะนำให้เปลี่ยนรหัสผ่านเป็นระยะๆ เพื่อความปลอดภัย
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecuritySection; 