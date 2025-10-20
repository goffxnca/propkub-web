import SelectInput from '../../UI/Public/Inputs/SelectInput';
import TextInput from '../../UI/Public/Inputs/TextInput';
import { getPostTypes } from '../../../libs/mappers/postTypeMapper';
import { getAssetTypes } from '../../../libs/mappers/assetTypeMapper';
import { getConditions } from '../../../libs/mappers/conditionMapper';
import { getPriceUnitList } from '../../../libs/mappers/priceUnitMapper';
import { getStandardAreaUnits } from '../../../libs/mappers/areaUnitMapper';
import { minLength, maxLength } from '../../../libs/form-validator';
import { useValidators } from '../../../hooks/useValidators';
import CheckboxGroupInput from '../../UI/Public/Inputs/CheckboxGroupInput';
import {
  getLandFacilities,
  getNonLandFacilities
} from '../../../libs/mappers/facilityMapper';
import TextWithUnitInput from '../../UI/Public/Inputs/TextWithUnitInput';
import { getDropdownOptions } from '../../../libs/mappers/dropdownOptionsMapper';
import { useEffect, useMemo } from 'react';
import TextEditorInput from '../../UI/Public/Inputs/TextEditorInput';
import CheckboxInput from '../../UI/Public/Inputs/CheckboxInput';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRouter } from 'next/router';

const genericDropdownItems = getDropdownOptions(5);

const BasicSection = ({
  register,
  unregister,
  watch,
  setValue,
  errors,
  isEditMode = false,
  defaultValues
}) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('posts');
  const { t: tForm } = useTranslation('pages/post-form');
  const {
    required,
    min: minValidator,
    max: maxValidator,
    minLength: minLengthValidator,
    maxLength: maxLengthValidator
  } = useValidators();
  const watchAssetType = watch('assetType');
  const watchPostType = watch('postType');
  const watchIsStudio = watch('isStudio');

  const isLand = useMemo(() => watchAssetType === 'land', [watchAssetType]);
  const isCondo = useMemo(() => watchAssetType === 'condo', [watchAssetType]);

  const facilityList = useMemo(
    () =>
      watchAssetType === 'land' ? getLandFacilities() : getNonLandFacilities(),
    [watchAssetType]
  );

  useEffect(() => {
    if (isLand && !isEditMode) {
      setValue('landUnit', 'rai');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLand]);

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {t('sections.basicInfo')}
          </h3>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="col-span-6">
            <TextInput
              id="title"
              label={t('fields.title')}
              register={() =>
                register('title', {
                  ...required(),
                  ...minLengthValidator(30),
                  ...maxLengthValidator(120)
                })
              }
              unregister={unregister}
              error={errors.title}
            />
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="postType"
                label={t('fields.postTypeAlt')}
                options={getPostTypes(locale)}
                disabled={isEditMode}
                register={() =>
                  register('postType', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={errors?.postType}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="assetType"
                label={t('fields.assetType')}
                options={getAssetTypes(locale)}
                disabled={isEditMode}
                register={() =>
                  register('assetType', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={errors?.assetType}
              />
            </div>

            {!isLand && (
              <div className="col-span-6 sm:col-span-3">
                <SelectInput
                  id="condition"
                  label={t('fields.condition')}
                  options={getConditions(locale)}
                  register={() =>
                    register('condition', {
                      ...required()
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
                unitItems={[
                  ...getPriceUnitList(watchAssetType, watchPostType, locale)
                ]}
                unitDefaultValues={['month', 'rai']}
                unitDefaultValue={defaultValues?.priceUnit || null}
                unitPrefix={tForm('fields.price.unitPrefix')}
                type="number"
                label={t('fields.price')}
                leadingSlot="฿"
                register={() =>
                  register('price', {
                    ...required(),
                    valueAsNumber: true,
                    ...minValidator(1),
                    ...maxValidator(100000000)
                  })
                }
                registerUnit={() =>
                  register('priceUnit', {
                    ...required()
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
                  unitItems={getStandardAreaUnits(locale)}
                  unitDefaultValues={['sqm']}
                  unitDefaultValue={defaultValues?.areaUnit || null}
                  type="number"
                  decimalPlaces={2}
                  label={t('fields.area')}
                  register={() =>
                    register('area', {
                      ...required(),
                      valueAsNumber: true,
                      ...minValidator(1),
                      ...maxValidator(1000000)
                    })
                  }
                  registerUnit={() =>
                    register('areaUnit', {
                      ...required()
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
                  unitItems={getStandardAreaUnits(locale)}
                  unitDefaultValues={['sqw']}
                  unitDefaultValue={defaultValues?.landUnit || null}
                  type="number"
                  decimalPlaces={2}
                  label={t('fields.land')}
                  register={() =>
                    register('land', {
                      ...required(),
                      valueAsNumber: true,
                      ...minValidator(1),
                      ...maxValidator(1000000)
                    })
                  }
                  registerUnit={() =>
                    register('landUnit', {
                      ...required()
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
                        register('specs.beds', {
                          valueAsNumber: true
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
                        register('specs.baths', {
                          valueAsNumber: true
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
                        register('specs.kitchens', {
                          valueAsNumber: true
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
                      register('specs.parkings', {
                        valueAsNumber: true
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
                register('refId', {
                  minLength: { ...minLength(4, 'หมายเลขอ้างอิง') },
                  maxLength: { ...maxLength(20, 'หมายเลขอ้างอิง') }
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
