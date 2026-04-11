import GoogleMap from '@/components/UI/GoogleMap';
import SelectInput from '@/components/UI/Inputs/SelectInput';
import TextInput from '@/components/UI/Inputs/TextInput';
import Modal from '@/components/UI/Modal';
import { useTranslation } from '@/hooks/useTranslation';
import { useValidators } from '@/hooks/useValidators';
import { envConfig } from '@/libs/envConfig';
import {
  getDistrictPrefix,
  getSubDistrictPrefix
} from '@/libs/formatters/addressFormatter';
import {
  fetchDistrictsByProvinceId,
  fetchProvincesByRegionId,
  fetchSubDistrictsByDistrictId
} from '@/libs/managers/addressManager';
import { getRegions } from '@/libs/mappers/regionMapper';
import { Locale } from '@/types/locale';
import { ReactHookFormError, ReactHookFormUnRegister } from '@/types/misc/form';
import { District, Province, SubDistrict } from '@/types/models/address';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors
} from 'react-hook-form';

const MAP_SEARCH_QUOTA = 5; //TODO: CHANGE TO 3 LATER

interface LocationSectionProps {
  register: UseFormRegister<any>;
  unregister: ReactHookFormUnRegister;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  submitCount: number;
  errors: FieldErrors<any>;
}

const LocationSection = ({
  register,
  unregister,
  watch,
  setValue,
  submitCount,
  errors
}: LocationSectionProps) => {
  const { t } = useTranslation('pages/post-form');
  const { t: tCommon } = useTranslation('common');
  const { required } = useValidators();
  const router = useRouter();
  const locale = router.locale as Locale;

  const regionList = useMemo(() => getRegions(locale), [locale]);

  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [subDistrictList, setSubDistrictList] = useState<SubDistrict[]>([]);

  const watchRegionId = watch('address.regionId');
  const watchProvinceId = watch('address.provinceId');
  const watchDistrictId = watch('address.districtId');
  const watchSubDistrictId = watch('address.subDistrictId');
  const watchAddressLocation = watch('address.location');
  const watchAddressSearch = watch('searchAddress');

  const [mapAddress, setAddress] = useState('');
  const [subDistrictLabel, setSubDistrictLabel] = useState('');
  const [showMapGuideModal, setShowMapGuideModal] = useState(false);

  const [showMapGuideModal2, setShowMapGuideModal2] = useState(false);

  const [streetViewHeading, setStreetViewHeading] = useState(0);

  const [mapSearchQuotaRemaining, setMapSearchQuotaRemaining] =
    useState(MAP_SEARCH_QUOTA);

  const isBangkok = useMemo(() => watchProvinceId === 'p1', [watchProvinceId]);

  // Skip map section in dev when no Google Maps key is available - see #15
  const missingMapKeyInDevMode = useMemo(
    () => !envConfig.mapKey() && envConfig.isDev(),
    []
  );

  useEffect(() => {
    if (missingMapKeyInDevMode) {
      setValue(
        'address.location',
        {
          lat: 13.746303,
          lng: 100.540463
        },
        { shouldValidate: submitCount > 0 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingMapKeyInDevMode]);

  useEffect(() => {
    setValue('address.provinceId', '', { shouldValidate: submitCount > 0 });

    if (watchRegionId) {
      fetchProvincesByRegionId(watchRegionId).then((result) => {
        setProvinceList(result);
      });
    } else {
      setProvinceList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchRegionId]);

  useEffect(() => {
    setValue('address.districtId', '', { shouldValidate: submitCount > 0 });

    if (watchProvinceId) {
      fetchDistrictsByProvinceId(watchProvinceId).then((result) => {
        setDistrictList(result);
      });
    } else {
      setDistrictList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchProvinceId]);

  useEffect(() => {
    setValue('address.subDistrictId', '', { shouldValidate: submitCount > 0 });

    if (watchDistrictId) {
      fetchSubDistrictsByDistrictId(watchDistrictId).then((result) => {
        setSubDistrictList(result);
      });
    } else {
      setSubDistrictList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDistrictId]);

  const renderMap = () => {
    if (watchSubDistrictId && mapSearchQuotaRemaining) {
      const districtElem = document.getElementById(
        'address.districtId'
      ) as HTMLSelectElement | null;
      const districtLabel =
        districtElem?.options[districtElem.selectedIndex]?.label || '';
      const subDistrictElem = document.getElementById(
        'address.subDistrictId'
      ) as HTMLSelectElement | null;
      const subDistrictLabel =
        subDistrictElem?.options[subDistrictElem.selectedIndex]?.label || '';

      setSubDistrictLabel(subDistrictLabel);
      if (districtLabel !== '-' && subDistrictLabel !== '-') {
        if (watchAddressSearch) {
          //Render map with typed address ex. Condo Ideo Mobi Sukhumvit Eastgate (Users can pin the map at a place which does not belong to the district or subdistrict, it's okay for us to accept this to happen)
          setAddress(`${watchAddressSearch}__search`); //with __search, means render map for the searched place and auto pin the map,
          // without __search means render the map area of specific subdistrict without pinning the map

          // setAddress(
          //   `${watchAddressSearch} ${getSubDistrictPrefix(
          //     isBangkok
          //   )}${subDistrictLabel} ${getDistrictPrefix(
          //     isBangkok
          //   )}${districtLabel}`
          // );
          setMapSearchQuotaRemaining((prevCount) => prevCount - 1);
        } else {
          //Render map at an area of specific subdistrict ex. Jompol, Chatuchak
          setAddress(
            `${getSubDistrictPrefix(isBangkok)}${subDistrictLabel} ${getDistrictPrefix(
              isBangkok
            )}${districtLabel}`
          );
        }
      }
    }
  };

  useEffect(() => {
    renderMap();
    if (watchSubDistrictId) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        setShowMapGuideModal(true);
        setValue('searchAddress', '');
        if (!missingMapKeyInDevMode) {
          setValue('address.location', null);
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSubDistrictId]);

  useEffect(() => {
    if (!mapSearchQuotaRemaining) {
      setValue('searchAddress', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapSearchQuotaRemaining]);

  // useEffect(() => {
  //   if (streetViewHeading) {
  //     setValue("address.location", {
  //       ...watchAddressLocation,
  //       h: streetViewHeading,
  //     });
  //   }
  // }, [streetViewHeading]);

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {t('sections.location.title')}
          </h3>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.regionId"
                label={t('fields.address.regionId.label')}
                options={regionList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.regionId', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={(errors?.address as any)?.regionId as ReactHookFormError}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.provinceId"
                label={t('fields.address.provinceId.label')}
                options={provinceList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.provinceId', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={
                  (errors?.address as any)?.provinceId as ReactHookFormError
                }
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.districtId"
                label={t('fields.address.districtId.label')}
                options={districtList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.districtId', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={
                  (errors?.address as any)?.districtId as ReactHookFormError
                }
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.subDistrictId"
                label={t('fields.address.subDistrictId.label')}
                options={subDistrictList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.subDistrictId', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={
                  (errors?.address as any)?.subDistrictId as ReactHookFormError
                }
              />
            </div>
            {!missingMapKeyInDevMode && (
              <Modal
                visible={showMapGuideModal}
                title={t('sections.location.map.modal.title')}
                desc={t('sections.location.map.modal.description')}
                buttonCaption={tCommon('buttons.ok')}
                Icon={LocationMarkerIcon}
                onClose={() => {
                  setShowMapGuideModal(false);
                  const timer = setTimeout(() => {
                    clearTimeout(timer);
                    document.getElementById('searchAddress').focus();
                  }, 1000);
                }}
              />
            )}
            {/* Maps */}
            {!missingMapKeyInDevMode && (
              <div className="col-span-6">
                {mapAddress && (
                  <>
                    {mapSearchQuotaRemaining <= MAP_SEARCH_QUOTA && (
                      <TextInput
                        id="searchAddress"
                        label={t('sections.location.map.searchLabel')}
                        placeholder={t(
                          'sections.location.map.searchPlaceholder'
                        )}
                        tailingSlot={
                          mapSearchQuotaRemaining ? (
                            <div
                              className="cursor-pointer bg-white text-primary  p-2 z-0"
                              onClick={() => {
                                if (mapSearchQuotaRemaining) {
                                  renderMap();
                                }
                              }}
                            >
                              {t('sections.location.map.searchButton')}
                            </div>
                          ) : null
                        }
                        disabled={!mapSearchQuotaRemaining}
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (mapSearchQuotaRemaining) {
                              renderMap();
                            }
                          }
                        }}
                        register={() => register('searchAddress', {})}
                        unregister={unregister}
                        error={
                          (errors?.address as any)?.search as ReactHookFormError
                        }
                      />
                    )}
                    <p className="text-xs text-gray-600 my-1">
                      {t('sections.location.map.quotaRemaining')}
                      <span className="text-red-600 text-lg px-2">
                        {mapSearchQuotaRemaining}
                      </span>
                      {t('sections.location.map.quotaNote')}
                    </p>
                    <p
                      className="text-primary text-sm underline mb-2 cursor-pointer select-none"
                      onClick={() => {
                        setShowMapGuideModal2(!showMapGuideModal2);
                      }}
                    >
                      {t('sections.location.map.guideToggle')}
                    </p>

                    {showMapGuideModal2 && (
                      <div className="ml-6 mb-2">
                        <p className="text-xs text-gray-600 mb-2">
                          {t('sections.location.map.guideTitle')}
                        </p>
                        <p className="text-xs text-gray-600">
                          1. คอนโดไอดีโอ โมบิ สุขุมวิท อีสท์เกต
                          <span className="italic ml-2">
                            {t('sections.location.map.guideExample1Note')}
                          </span>
                        </p>
                        <p className="text-xs text-gray-600">
                          2. Condo Ideo Mobi Sukhumvit Eastgate
                          <span className="italic ml-2">
                            {t('sections.location.map.guideExample2Note')}
                          </span>
                        </p>
                        <p className="text-xs text-gray-600">
                          {t('sections.location.map.guideExample3')}
                          <span className="italic ml-2">
                            {t('sections.location.map.guideExample3Note')}
                          </span>
                        </p>
                        <p className="text-xs text-gray-600">
                          {t('sections.location.map.guideExample4')}
                          <span className="italic ml-2">
                            {t('sections.location.map.guideExample4Note')}
                          </span>
                        </p>

                        <p className="text-xs text-red-400">
                          {t('sections.location.map.guideExample5')}
                        </p>
                      </div>
                    )}

                    <div
                      className={`${(errors?.address as any)?.location && 'border border-red-400'}`}
                    >
                      <GoogleMap
                        address={mapAddress}
                        onLocationSelected={(location) => {
                          setValue(
                            'address.location',
                            location
                              ? {
                                  lat: location.lat,
                                  lng: location.lng
                                  // h: 0,
                                }
                              : null,
                            { shouldValidate: submitCount > 0 }
                          );
                          // setStreetViewHeading(0);
                        }}
                      />
                    </div>

                    {/* {watchAddressLocation && (
                    <div className="relative">
                      <div className="text-sm text-gray-500 mt-2">
                        The StreetView map below shows from the location you pinned
                        and will be displayed on the listing at this exact angle
                        If you cannot find it by panning left/right,
                        you need to pin the map closer
                      </div>

                      <PostMap
                        mode="streetview"
                        lat={watchAddressLocation?.lat}
                        lng={watchAddressLocation?.lng}
                        heading={streetViewHeading}
                      />
                      <div className="absolute z-10 w-full h-full top-0 left-0 right-0 flex">
                        <div className="items-center my-auto">
                          <div
                            className="bg-white p-2 text-sm text-primary cursor-pointer select-none rounded-r-md"
                            onClick={() => {
                              setStreetViewHeading((prev) => {
                                const newHeading = prev - 40;
                                return newHeading <= 0 ? 360 : newHeading;
                              });
                            }}
                          >
                            Rotate Left
                          </div>
                        </div>

                        <div className="items-center my-auto ml-auto">
                          <div
                            className="bg-white p-2 text-sm text-primary cursor-pointer select-none rounded-l-md"
                            onClick={() => {
                              setStreetViewHeading((prev) => {
                                const newHeading = prev + 40;
                                return newHeading >= 360 ? 0 : newHeading;
                              });
                            }}
                          >
                            Rotate Right
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}

                    <div>
                      <input
                        id="address.location"
                        disabled
                        hidden
                        {...register('address.location', {
                          ...required()
                        })}
                      />
                      {(errors?.address as any)?.location && (
                        <div className="text-red-400 text-xs py-1">
                          {(errors.address as any).location.message}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
