import TextInput from "../UI/Public/Inputs/TextInput";
import {
  maxLength,
  minLength,
  MobilePhonePattern,
} from "../../libs/form-validator";
import ProfileImageInput from "../UI/Public/Inputs/ProfileImageInput/ProfileImageInput";

const ProfileSection = ({
  userProfile,
  register,
  unregister,
  watch,
  setValue,
  errors,
  submitCount = 0,
}) => {
  console.log("ProfileSection");

  const emailVerified = userProfile.emailVerified
    ? "ยืนยันแล้ว"
    : "ยังไม่ยืนยัน";

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            ข้อมูลสาธารณะ
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            ข้อมูลเหล่านี้จะปรากฎในทุกประกาศของคุณ
            ช่วยให้ผู้สนใจประกาศติดต่อคุณได้ง่ายขึ้น
          </p>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="name"
                label="ชื่อ"
                register={() =>
                  register("name", {
                    required: "กรุณาระบุชื่อ",
                    minLength: { ...minLength(3, "ชื่อ") },
                    maxLength: { ...maxLength(30, "ชื่อ") },
                  })
                }
                unregister={unregister}
                error={errors.name}
                placeholder="ชื่อที่คุณต้องการให้แสดงบนประกาศ"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="email"
                label="อีเมล"
                value={userProfile.email}
                tailingSlot={emailVerified}
                disabled
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="phone"
                label="หมายเลขโทรศัพท์มือถือ"
                register={() =>
                  register("phone", {
                    required: "กรุณาระบุหมายเลขโทรศัพท์มือถือ",
                    pattern: MobilePhonePattern("หมายเลขโทรศัพท์มือถือ"),
                  })
                }
                unregister={unregister}
                error={errors.phone}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <TextInput
                id="line"
                label="ไลน์ไอดี"
                placeholder={"หากมีเครื่องหมาย @ ต้องระบุด้วย"}
                register={() =>
                  register("line", {
                    required: "กรุณาระบุไลน์ไอดี",
                    minLength: { ...minLength(4, "ไลน์ไอดี") },
                    maxLength: { ...maxLength(30, "ไลน์ไอดี") },
                  })
                }
                unregister={unregister}
                error={errors.line}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <ProfileImageInput
                id="profileImg"
                label="รูปโพรไฟล์"
                register={() =>
                  register("profileImg", {
                    required: "กรุณาอัพโหลดรูปโปรไฟล์",
                  })
                }
                originFileUrl={userProfile.profileImg}
                unregister={unregister}
                error={errors.profileImg}
                setValue={setValue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
