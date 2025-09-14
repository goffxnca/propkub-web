import regions from '../../../data/regions.json';
import SelectInput from '../../UI/Public/Inputs/SelectInput';
import { useEffect, useMemo, useState } from 'react';
import GoogleMap from '../../UI/Public/GoogleMap';
import TextInput from '../../UI/Public/Inputs/TextInput';
import Modal from '../../UI/Public/Modal';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import {
  fetchProvincesByRegionId,
  fetchDistrictsByProvinceId,
  fetchSubDistrictsByDistrictId
} from '../../../libs/managers/addressManager';
import {
  getDistrictPrefix,
  getSubDistrictPrefix
} from '../../../libs/formatters/addressFomatter';
import PostMap from '../../../components/Posts/PostMap';

const MAP_SEARCH_QUOTA = 5; //TODO: CHANGE TO 3 LATER

const LocationSection = ({
  register,
  unregister,
  watch,
  setValue,
  submitCount,
  errors
}) => {
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);

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

  // computed;
  const isBangkok = useMemo(() => watchProvinceId === 'p1', [watchProvinceId]);

  // useEffects
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
      const districtElem = document.getElementById('address.districtId');
      const distictLabel = districtElem.item(districtElem.selectedIndex).label;
      const subDistrictElem = document.getElementById('address.subDistrictId');
      const subDistrictLabel = subDistrictElem.item(
        subDistrictElem.selectedIndex
      ).label;

      setSubDistrictLabel(subDistrictLabel);
      if (distictLabel !== '-' && subDistrictLabel !== '-') {
        if (watchAddressSearch) {
          //Render map with typed address ex.คอนโด Ideo O2 (User can pinned the map at place which is not belong to district or subdistrict, it's okay we are accept this to happen)
          setAddress(`${watchAddressSearch}__search`); //with __search, means render map for the searched place and auto pin the map,
          // without __search means render the map area of specific subDistrict without pinning the map

          // setAddress(
          //   `${watchAddressSearch} ${getSubDistrictPrefix(
          //     isBangkok
          //   )}${subDistrictLabel} ${getDistrictPrefix(
          //     isBangkok
          //   )}${distictLabel}`
          // );
          setMapSearchQuotaRemaining((prevCount) => prevCount - 1);
        } else {
          //Render map at an area of specific subdistrict ex.แขวงจุมพล เขตจตุจักร
          setAddress(
            `${getSubDistrictPrefix(isBangkok)}${subDistrictLabel} ${getDistrictPrefix(
              isBangkok
            )}${distictLabel}`
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
        setValue('address.location', null);
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
            ตำแหน่งที่ตั้งทรัพย์
          </h3>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.regionId"
                label="ภูมิภาค"
                options={regions}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.regionId', {
                    required: 'กรุณาระบุภูมิภาค'
                  })
                }
                unregister={unregister}
                error={errors?.address?.regionId}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.provinceId"
                label="จังหวัด"
                options={provinceList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.provinceId', {
                    required: 'กรุณาระบุจังหวัด'
                  })
                }
                unregister={unregister}
                error={errors?.address?.provinceId}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.districtId"
                label="เขต/อำเภอ"
                options={districtList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.districtId', {
                    required: 'กรุณาระบุเขต/อำเภอ'
                  })
                }
                unregister={unregister}
                error={errors?.address?.districtId}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <SelectInput
                id="address.subDistrictId"
                label="แขวง/ตำบล"
                options={subDistrictList}
                disabled={!mapSearchQuotaRemaining}
                register={() =>
                  register('address.subDistrictId', {
                    required: 'กรุณาระบุแขวง/ตำบล'
                  })
                }
                unregister={unregister}
                error={errors?.address?.subDistrictId}
              />
            </div>
            <Modal
              visible={showMapGuideModal}
              title="การปักหมุด"
              // desc={`เราได้แสดงแผนที่คร่าวๆของ ${getSubDistrictPrefix(
              //   isBangkok
              // )}${subDistrictLabel} แล้ว คุณสามารถซูมเข้าออก/เลื่อนไปมา เพื่อหาจุดที่ตั้งของทรัพย์ และลากหมุดสีแดงเพื่อยืนยันพิกัด หรือพิมพ์ชื่อสถานที่ใกล้เคียงบนช่องด้านบนเพื่อค้นหาง่ายขึ้น`}
              desc="เริ่มต้นปักหมุดโดยพิมพ์ชื่อโครงการ/สถานที่บนช่องค้นหาด้านบน"
              Icon={LocationMarkerIcon}
              onClose={() => {
                setShowMapGuideModal(false);
                const timer = setTimeout(() => {
                  clearTimeout(timer);
                  document.getElementById('searchAddress').focus();
                }, 1000);
              }}
            />
            {/* Maps */}
            <div className="col-span-6">
              {mapAddress && (
                <>
                  {mapSearchQuotaRemaining <= MAP_SEARCH_QUOTA && (
                    <TextInput
                      id="searchAddress"
                      label="พิมพ์คำค้นหาเพื่อปักหมุดอัตโนมัติ"
                      placeholder="ค้นหาด้วยชื่อโครงการเช่น คอนโดไอดีโอ โอทู (หรืออ่านคำแนะนำการปักแผนที่ด้านล่าง)"
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
                            ค้นหา
                          </div>
                        ) : null
                      }
                      disabled={!mapSearchQuotaRemaining}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (mapSearchQuotaRemaining) {
                            renderMap();
                          }
                        }
                      }}
                      register={() => register('searchAddress', {})}
                      unregister={unregister}
                      error={errors?.address?.search}
                    />
                  )}
                  <p className="text-xs text-gray-600 my-1">
                    โควต้าการค้นหาบนแผนที่เหลือ
                    <span className="text-red-600 text-lg px-2">
                      {mapSearchQuotaRemaining}
                    </span>
                    ครั้ง **เราจำกัดจำนวนครั้งการค้นหาเนื่องจาก Google Map
                    มีค่าบริการสูง
                  </p>
                  <p
                    className="text-primary text-sm underline mb-2 cursor-pointer select-none"
                    onClick={() => {
                      setShowMapGuideModal2(!showMapGuideModal2);
                    }}
                  >
                    อ่านคำแนะนำการปักแผนที่
                  </p>

                  {showMapGuideModal2 && (
                    <div className="ml-6 mb-2">
                      <p className="text-xs text-gray-600 mb-2">
                        ตัวอย่างคำค้นหาที่ช่วยให้เจอที่ตั้งของทรัพย์ได้ง่ายขึ้น
                        โดยให้ลองตามลำดับ
                      </p>
                      <p className="text-xs text-gray-600">
                        1. คอนโดไอดีโอ โอทู
                        <span className="italic ml-2">
                          (ชื่อโครงการเต็มภาษาไทย)
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        2. Condo Ideo O2
                        <span className="italic ml-2">
                          (ชื่อโครงการเต็มภาษาอังกฤษ)
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        3. คอนโดไอดีโอ โอทู ถนนสรรพาวุธ
                        <span className="italic ml-2">
                          (ชื่อโครงการ + ถนน/ซอย)
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        4. คอนโดไอดีโอ โอทู บางนา
                        <span className="italic ml-2">
                          (ชื่อโครงการ + เขต/อำเภอ)
                        </span>
                      </p>
                      {/* <p className="text-xs text-gray-600 mb-2">
                        คอนโดไอดีโอ โอทู บางนา กรุงเทพมหานคร
                        <span className="italic ml-2">
                          (ชื่อโครงการ + เขต/อำเภอ + จังหวัด)
                        </span>
                      </p> */}

                      <p className="text-xs text-red-400">
                        5. หากคุณค้นหาแล้ว 4 ครั้งยังไม่เจอ
                        ครั้งสุดท้ายให้คุณค้นหาสถานที่สำคัญที่ใกล้เคียงที่สุด
                        เช่นสี่แยกบางนา
                        หลังจากนั้นให้เลื่อนแผนที่เพื่อปักหมุดเอง
                      </p>
                    </div>
                  )}

                  <div
                    className={`${errors?.address?.location && 'border border-red-400'}`}
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
                        ด้านล่างเป็นแผนที่ StreetView จากตำแหน่งที่คุณปักหมุด
                        ซึ่งจะถูกแสดงบนประกาศมุมและองศาตรงตามนี้เลย
                        หากเลื่อนซ้ายขวาแล้วไม่เจอ
                        แสดงว่าคุณต้องปักหมุดใกล้กว่านี้อีก
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
                            หมุนซ้าย
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
                            หมุนขวา
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
                        required: true
                      })}
                    />
                    {errors?.address?.location && (
                      <div className="text-red-400 text-xs py-1">
                        กรุณาปักหมุดบนแผนที่เพื่อยืนยันที่ตั้งทรัพย์
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
