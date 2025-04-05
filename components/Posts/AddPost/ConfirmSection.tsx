import { ACCEPT_POST_FBSHARE, ACCEPT_POST_MSG } from "../../../libs/constants";
import CheckboxInput from "../../UI/Public/Inputs/CheckboxInput";

const ConfirmSection = ({ register, unregister, errors }) => {
  console.log("ConfirmSection");

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            ยืนยันข้อมูล
          </h3>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <CheckboxInput
                id="accept"
                label={ACCEPT_POST_MSG}
                register={() =>
                  register("accept", {
                    required: "กรุณายืนยัน",
                  })
                }
                unregister={unregister}
                error={errors.accept}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSection;
