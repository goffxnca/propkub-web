import CheckboxGroupInput from '@/components/UI/Inputs/CheckboxGroupInput';
import CheckboxInput from '@/components/UI/Inputs/CheckboxInput';
import SelectInput from '@/components/UI/Inputs/SelectInput';
import TextEditorInput from '@/components/UI/Inputs/TextEditorInput';
import TextInput from '@/components/UI/Inputs/TextInput';
import TextWithUnitInput from '@/components/UI/Inputs/TextWithUnitInput';
import { useTranslation } from '@/hooks/useTranslation';
import { useValidators } from '@/hooks/useValidators';
import { getStandardAreaUnits } from '@/libs/mappers/areaUnitMapper';
import { getAssetTypes } from '@/libs/mappers/assetTypeMapper';
import { getConditions } from '@/libs/mappers/conditionMapper';
import { getDropdownOptions } from '@/libs/mappers/dropdownOptionsMapper';
import {
  getLandFacilities,
  getNonLandFacilities
} from '@/libs/mappers/facilityMapper';
import { getPostTypes } from '@/libs/mappers/postTypeMapper';
import { getPriceUnitList } from '@/libs/mappers/priceUnitMapper';
import { Locale } from '@/types/locale';
import { ReactHookFormError, ReactHookFormUnRegister } from '@/types/misc/form';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors
} from 'react-hook-form';

const genericDropdownItems = getDropdownOptions(5);

interface BasicSectionDefaultValues {
  priceUnit?: string;
  areaUnit?: string;
  landUnit?: string;
  desc?: string;
  [key: string]: any;
}

interface BasicSectionProps {
  register: UseFormRegister<any>;
  unregister: ReactHookFormUnRegister;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  isEditMode?: boolean;
  defaultValues?: BasicSectionDefaultValues;
}

const BasicSection = ({
  register,
  unregister,
  watch,
  setValue,
  errors,
  isEditMode = false,
  defaultValues = {}
}: BasicSectionProps) => {
  const router = useRouter();
  const locale = router.locale as Locale;
  const { t } = useTranslation('posts');
  const { t: tForm } = useTranslation('pages/post-form');
  const { required, min, max, minLength, maxLength } = useValidators();
  const watchAssetType = watch('assetType');
  const watchPostType = watch('postType');
  const watchIsStudio = watch('isStudio');

  const isLand = useMemo(() => watchAssetType === 'land', [watchAssetType]);
  const isCondo = useMemo(() => watchAssetType === 'condo', [watchAssetType]);

  const facilityList = useMemo(
    () =>
      watchAssetType === 'land'
        ? getLandFacilities(locale)
        : getNonLandFacilities(locale),
    [watchAssetType, locale]
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
                  ...minLength(30),
                  ...maxLength(120)
                })
              }
              unregister={unregister}
              error={errors.title as ReactHookFormError}
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
                error={errors?.postType as ReactHookFormError}
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
                error={errors?.assetType as ReactHookFormError}
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
                  error={errors?.condition as ReactHookFormError}
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
                    ...min(1),
                    ...max(100000000)
                  })
                }
                registerUnit={() =>
                  register('priceUnit', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={
                  (errors?.price || errors?.priceUnit) as ReactHookFormError
                }
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
                      ...min(1),
                      ...max(1000000)
                    })
                  }
                  registerUnit={() =>
                    register('areaUnit', {
                      ...required()
                    })
                  }
                  unregister={unregister}
                  error={
                    (errors?.area || errors?.areaUnit) as ReactHookFormError
                  }
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
                      ...min(1),
                      ...max(1000000)
                    })
                  }
                  registerUnit={() =>
                    register('landUnit', {
                      ...required()
                    })
                  }
                  unregister={unregister}
                  error={
                    (errors?.land || errors?.landUnit) as ReactHookFormError
                  }
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
                      label={t('fields.specs.beds')}
                      showPreOption={false}
                      options={genericDropdownItems}
                      register={() =>
                        register('specs.beds', {
                          valueAsNumber: true
                        })
                      }
                      unregister={unregister}
                      error={(errors?.specs as any)?.beds as ReactHookFormError}
                    />
                  </div>
                )}

                {!watchIsStudio && (
                  <div className="col-span-6 sm:col-span-3">
                    <SelectInput
                      id="specs.baths"
                      label={t('fields.specs.baths')}
                      showPreOption={false}
                      options={genericDropdownItems}
                      register={() =>
                        register('specs.baths', {
                          valueAsNumber: true
                        })
                      }
                      unregister={unregister}
                      error={
                        (errors?.specs as any)?.baths as ReactHookFormError
                      }
                    />
                  </div>
                )}

                {!watchIsStudio && (
                  <div className="col-span-6 sm:col-span-3">
                    <SelectInput
                      id="specs.kitchens"
                      label={t('fields.specs.kitchens')}
                      showPreOption={false}
                      options={genericDropdownItems}
                      register={() =>
                        register('specs.kitchens', {
                          valueAsNumber: true
                        })
                      }
                      unregister={unregister}
                      error={
                        (errors?.specs as any)?.kitchens as ReactHookFormError
                      }
                    />
                  </div>
                )}

                <div className="col-span-6 sm:col-span-3">
                  <SelectInput
                    id="specs.parkings"
                    label={t('fields.specs.parkings')}
                    showPreOption={false}
                    options={genericDropdownItems}
                    register={() =>
                      register('specs.parkings', {
                        valueAsNumber: true
                      })
                    }
                    unregister={unregister}
                    error={
                      (errors?.specs as any)?.parkings as ReactHookFormError
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="col-span-6">
            <TextEditorInput
              id="desc"
              label={t('fields.desc')}
              info={tForm('fields.desc.info')}
              validation={{
                ...required(),
                ...minLength(200),
                ...maxLength(3000)
              }}
              register={register}
              unregister={unregister}
              setValue={setValue}
              error={errors?.desc_raw as ReactHookFormError}
              defaultValue={defaultValues?.desc}
            />
          </div>

          <div className="col-span-6">
            <CheckboxGroupInput
              id="facilities"
              groupLabel={t('fields.facilities')}
              items={facilityList}
              register={register}
              unregister={unregister}
            />
          </div>

          <div className="col-span-3">
            <TextInput
              id="refId"
              label={tForm('fields.refId.label')}
              placeholder={tForm('fields.refId.placeholder')}
              register={() =>
                register('refId', {
                  ...minLength(4),
                  ...maxLength(20)
                })
              }
              unregister={unregister}
              error={errors.refId as ReactHookFormError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSection;
