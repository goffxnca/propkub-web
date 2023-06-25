import TextInput from "../../UI/Public/Inputs/TextInput";
import {
  minLength,
  maxLength,
  MobilePhonePattern,
} from "../../../libs/form-validator";

const AgentContactSection = ({
  register,
  unregister,
  errors,
  isMember = false,
  isEditMode = false,
}) => {
  console.log("AgentContactSection");

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            ข้อมูลผู้ลงประกาศ
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            ข้อมูลนี้ช่วยให้ผู้สนใจประกาศติดต่อคุณได้ง่ายขึ้น
          </p>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="contactInfo.name"
                label="ชื่อผู้ประกาศ"
                register={() =>
                  register("contactInfo.name", {
                    required: "กรุณาระบุชื่อผู้ประกาศ",
                    minLength: { ...minLength(6, "ชื่อผู้ประกาศ") },
                    maxLength: { ...maxLength(30, "ชื่อผู้ประกาศ") },
                  })
                }
                unregister={unregister}
                error={errors.contactInfo?.name}
                placeholder="สมชาย TheBestAgent"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="contactInfo.phone"
                label="หมายเลขโทรศัพท์มือถือ"
                register={() =>
                  register("contactInfo.phone", {
                    required: "กรุณาระบุหมายเลขโทรศัพท์มือถือ",
                    pattern: MobilePhonePattern("หมายเลขโทรศัพท์มือถือ"),
                  })
                }
                unregister={unregister}
                error={errors.contactInfo?.phone}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="contactInfo.line"
                label="ไลน์ไอดี"
                placeholder={"หากมีเครื่องหมาย @ ต้องระบุด้วย"}
                register={() =>
                  register("contactInfo.line", {
                    required: "กรุณาระบุไลน์ไอดี",
                    minLength: { ...minLength(4, "ไลน์ไอดี") },
                    maxLength: { ...maxLength(30, "ไลน์ไอดี") },
                  })
                }
                unregister={unregister}
                error={errors.contactInfo?.line}
              />
            </div>

            {!isMember && (
              <div className="col-span-6 sm:col-span-3">
                <TextInput
                  id="contactInfo.passcode"
                  label="รหัสแก้ไขประกาศ"
                  type={isEditMode ? "password" : "text"}
                  placeholder={"รหัสสำหรับการแก้ไขหรือลบประกาศภายหลัง"}
                  register={() =>
                    register("contactInfo.passcode", {
                      required: "กรุณาระบุรหัสแก้ไขประกาศ",
                      minLength: { ...minLength(6, "รหัสแก้ไขประกาศ") },
                      maxLength: { ...maxLength(64, "รหัสแก้ไขประกาศ") },
                    })
                  }
                  disabled={isEditMode}
                  unregister={unregister}
                  error={errors.contactInfo?.passcode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentContactSection;
