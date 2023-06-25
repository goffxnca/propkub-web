import SelectInput from "../../UI/Public/Inputs/SelectInput";
import TextInput from "../../UI/Public/Inputs/TextInput";
import { postTypes, getPostType } from "../../../libs/mappers/postTypeMapper";
import { assetTypes } from "../../../libs/mappers/assetTypeMapper";
import { conditions } from "../../../libs/mappers/conditionMapper";
import { getPriceUnitList } from "../../../libs/mappers/priceUnitMapper";
import { getStandardAreaUnits } from "../../../libs/mappers/areaUnitMapper";
import { min, max, minLength, maxLength } from "../../../libs/form-validator";
import CheckboxGroupInput from "../../UI/Public/Inputs/CheckboxGroupInput";
import {
  getLandFacilities,
  getNonLandFacilities,
} from "../../../libs/mappers/facilityMapper";
import TextWithUnitInput from "../../UI/Public/Inputs/TextWithUnitInput";
import { getDropwnOptions } from "../../../libs/mappers/dropdownOptionsMapper";
import { useEffect, useMemo } from "react";
import TextEditorInput from "../../UI/Public/Inputs/TextEditorInput";
import CheckboxInput from "../../UI/Public/Inputs/CheckboxInput";

const genericDropdownItems = getDropwnOptions(5);

const BasicSection = ({
  register,
  unregister,
  watch,
  setValue,
  errors,
  isEditMode = false,
  defaultValues,
}) => {
  console.log("BasicSection");
  const watchAssetType = watch("assetType");
  const watchPostType = watch("postType");
  const watchIsStudio = watch("isStudio");

  const isLand = useMemo(() => watchAssetType === "land", [watchAssetType]);
  const isCondo = useMemo(() => watchAssetType === "condo", [watchAssetType]);

  const facilityList = useMemo(
    () =>
      watchAssetType === "land" ? getLandFacilities() : getNonLandFacilities(),
    [watchAssetType]
  );

  useEffect(() => {
    if (isLand && !isEditMode) {
      setValue("landUnit", "rai");
    }
  }, [isLand]);

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            ข้อมูลพื้นฐาน
          </h3>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="col-span-6">
            <TextInput
              id="title"
              label="หัวข้อประกาศ"
              register={() =>
                register("title", {
                  required: "กรุณาระบุหัวข้อประกาศ",
                  minLength: { ...minLength(30, "หัวข้อประกาศ") },
                  maxLength: { ...maxLength(120, "หัวข้อประกาศ") },
                })
              }
              unregister={unregister}
              error={errors.title}
            />
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="assetType"
                label="ประเภททรัพย์"
                options={assetTypes}
                disabled={isEditMode}
                register={() =>
                  register("assetType", {
                    required: "กรุณาระบุประเภททรัพย์",
                  })
                }
                unregister={unregister}
                error={errors?.assetType}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="postType"
                label="ต้องการ"
                options={postTypes}
                register={() =>
                  register("postType", {
                    required: "กรุณาระบุประเภทประกาศ",
                  })
                }
                unregister={unregister}
                error={errors?.postType}
              />
            </div>

            {!isLand && (
              <div className="col-span-6 sm:col-span-3">
                <SelectInput
                  id="condition"
                  label="ลักษณะทรัพย์"
                  options={conditions}
                  register={() =>
                    register("condition", {
                      required: "กรุณาระบุลักษณะทรัพย์",
                    })
                  }
                  unregister={unregister}
                  error={errors?.condition}
                />
              </div>
            )}

            <div className="col-span-6 sm:col-span-3">
              <TextWithUnitInput
                id="price"
                unitId="priceUnit"
                unitItems={[...getPriceUnitList(watchAssetType, watchPostType)]}
                unitDefaultValues={["month", "rai"]}
                unitDefaultValue={defaultValues?.priceUnit || null}
                unitPrefix="ต่อ"
                type="number"
                label={`ราคา${getPostType(watchPostType)}`}
                leadingSlot="฿"
                register={() =>
                  register("price", {
                    required: `กรุณาระบุราคา`,
                    valueAsNumber: true,
                    min: { ...min(1, "ราคา") },
                    max: { ...max(100000000, "ราคา") },
                  })
                }
                registerUnit={() =>
                  register("priceUnit", {
                    required: "กรุณาระบุหน่วยราคา",
                  })
                }
                unregister={unregister}
                error={errors?.price || errors?.priceUnit}
                setValue={setValue}
              />
            </div>

            {!isLand && (
              <div className="col-span-6 sm:col-span-3">
                <TextWithUnitInput
                  id="area"
                  unitId="areaUnit"
                  unitItems={getStandardAreaUnits()}
                  unitDefaultValues={["sqm"]}
                  unitDefaultValue={defaultValues?.areaUnit || null}
                  type="number"
                  decimalPlaces={2}
                  label="พื้นที่ใช้สอย"
                  register={() =>
                    register("area", {
                      required: "กรุณาระบุขนาดพื้นที่ใช้สอย",
                      valueAsNumber: true,
                      min: { ...min(1, "ขนาดพื้นที่ใช้สอย") },
                      max: { ...max(1000000, "ขนาดพื้นที่ใช้สอย") },
                    })
                  }
                  registerUnit={() =>
                    register("areaUnit", {
                      required: "กรุณาระบุหน่วยพื้นที่ใช้สอย",
                    })
                  }
                  unregister={unregister}
                  error={errors?.area || errors?.areaUnit}
                  setValue={setValue}
                />
              </div>
            )}

            {!isCondo && (
              <div className="col-span-6 sm:col-span-3">
                <TextWithUnitInput
                  id="land"
                  unitId="landUnit"
                  unitItems={getStandardAreaUnits()}
                  unitDefaultValues={["sqw"]}
                  unitDefaultValue={defaultValues?.landUnit || null}
                  type="number"
                  decimalPlaces={2}
                  label="ขนาดที่ดิน"
                  register={() =>
                    register("land", {
                      required: "กรุณาระบุขนาดที่ดิน",
                      valueAsNumber: true,
                      min: { ...min(1, "ขนาดที่ดิน") },
                      max: { ...max(1000000, "ขนาดที่ดิน") },
                    })
                  }
                  registerUnit={() =>
                    register("landUnit", {
                      required: "กรุณาระบุหน่วยที่ดิน",
                    })
                  }
                  unregister={unregister}
                  error={errors?.land || errors?.landUnit}
                  setValue={setValue}
                />
              </div>
            )}

            {!isLand && (
              <>
                {isCondo && (
                  <div className="col-span-6 sm:col-span-6">
                    <CheckboxInput
                      id="isStudio"
                      label="ห้องประเภท Studio"
                      register={register}
                      unregister={unregister}
                    />
                  </div>
                )}

                {!watchIsStudio && (
                  <div className="col-span-6 sm:col-span-3">
                    <SelectInput
                      id="specs.beds"
                      label="ห้องนอน"
                      showPreOption={false}
                      options={genericDropdownItems}
                      register={() =>
                        register("specs.beds", {
                          valueAsNumber: true,
                        })
                      }
                      unregister={unregister}
                      error={errors?.specs?.beds}
                    />
                  </div>
                )}

                {!watchIsStudio && (
                  <div className="col-span-6 sm:col-span-3">
                    <SelectInput
                      id="specs.baths"
                      label="ห้องน้ำ"
                      type="number"
                      showPreOption={false}
                      options={genericDropdownItems}
                      register={() =>
                        register("specs.baths", {
                          valueAsNumber: true,
                        })
                      }
                      unregister={unregister}
                      error={errors?.specs?.baths}
                    />
                  </div>
                )}

                {!watchIsStudio && (
                  <div className="col-span-6 sm:col-span-3">
                    <SelectInput
                      id="specs.kitchens"
                      label="ห้องครัว"
                      type="number"
                      showPreOption={false}
                      options={genericDropdownItems}
                      register={() =>
                        register("specs.kitchens", {
                          valueAsNumber: true,
                        })
                      }
                      unregister={unregister}
                      error={errors?.specs?.kitchens}
                    />
                  </div>
                )}

                <div className="col-span-6 sm:col-span-3">
                  <SelectInput
                    id="specs.parkings"
                    label="ที่จอดรถ"
                    type="number"
                    showPreOption={false}
                    options={genericDropdownItems}
                    register={() =>
                      register("specs.parkings", {
                        valueAsNumber: true,
                      })
                    }
                    unregister={unregister}
                    error={errors?.specs?.parkings}
                  />
                </div>
              </>
            )}
          </div>

          <div className="col-span-6">
            <TextEditorInput
              id="desc"
              label="รายละเอียด"
              register={register}
              unregister={unregister}
              setValue={setValue}
              error={errors?.desc_raw}
              defaultValue={defaultValues.desc}
            />
          </div>

          <div className="col-span-6">
            <CheckboxGroupInput
              id="facilities"
              groupLabel="สาธารณูปโภคอื่นๆ"
              items={facilityList}
              register={register}
              unregister={unregister}
            />
          </div>

          <div className="col-span-3">
            <TextInput
              id="refId"
              label="หมายเลขอ้างอิง (ถ้ามี)"
              placeholder="หมายเลขอ้างอิงภายในของ Agent เอง"
              register={() =>
                register("refId", {
                  minLength: { ...minLength(4, "หมายเลขอ้างอิง") },
                  maxLength: { ...maxLength(20, "หมายเลขอ้างอิง") },
                })
              }
              unregister={unregister}
              error={errors.refId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSection;
