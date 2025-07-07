import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./PostFilter.module.css";

import orderby from "lodash.orderby";

import LocationIcon from "../Icons/LocationIcon";
import DollarIcon from "../Icons/DollarIcon";
import { SearchIcon, ArrowRightIcon } from "@heroicons/react/solid";

import regions from "../../data/regions.json";

import { assetTypes } from "../../libs/mappers/assetTypeMapper";
import { conditions } from "../../libs/mappers/conditionMapper";

import TextInput from "../UI/Public/Inputs/TextInput";
import SelectInput from "../UI/Public/Inputs/SelectInput";

import Loader from "../UI/Common/modals/Loader";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import {
  fetchProvincesByRegionId,
  fetchDistrictsByProvinceId,
  fetchSubDistrictsByDistrictId,
} from "../../libs/managers/addressManager";

const postTypes = [
  { id: "rent", label: "เช่า", searchFor: "rent" },
  { id: "buy", label: "ซื้อ", searchFor: "sale" },
  { id: "sale", label: "ลงประกาศ" },
];

const initialFilters = {
  postType: "",
  assetType: "",
  regionId: "",
  provinceId: "",
  districtId: "",
  subDistrictId: "",
  minPrice: 0,
  maxPrice: 0,
  condition: "",
  keyword: "",
  loading: false,
};

const PostFilter = ({ onSearch, onReset }) => {
  console.log("PostFilter");

  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState({ ...initialFilters });

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);

  //computed
  const postTypeList = postTypes.map((postType) => ({
    ...postType,
    isActive: searchFilter.postType.id === postType.id,
  }));

  const assetTypeList = assetTypes.map((assetType) => ({
    ...assetType,
    isActive: searchFilter.assetType === assetType.id,
  }));

  const regionList = useMemo(() => orderby(regions, "name", "asc"), []);

  // const provinceList = useMemo(() => {
  //   return orderby(
  //     provinces.filter((p) => p.regionId === searchFilter.regionId),
  //     "name",
  //     "asc"
  //   );
  // }, [searchFilter.regionId]);

  // const districtList = useMemo(
  //   () =>
  //     orderby(
  //       districts.filter((d) => d.provinceId === searchFilter.provinceId),
  //       "name",
  //       "asc"
  //     ),
  //   [searchFilter.provinceId]
  // );

  // const subDistrictList = useMemo(
  //   () =>
  //     orderby(
  //       subDistricts.filter((d) => d.districtId === searchFilter.districtId),
  //       "name",
  //       "asc"
  //     ),
  //   [searchFilter.districtId]
  // );

  //handlers
  const selectPostTypeHandler = (postType) => {
    if (postType.id !== searchFilter.postType.id) {
      if (postType.id === "sale") {
        router.push("/login");
      } else {
        setSearchFilter((state) => ({
          ...state,
          postType: { id: postType.id, searchFor: postType.searchFor },
          assetType: "",
        }));
      }
    }
  };

  const selectAssetTypeHandler = (assetType) => {
    console.log("selectAssetTypeHandler");
    setSearchFilter((state) => ({ ...state, assetType: assetType }));
  };

  const searchHandler = (event) => {
    event.preventDefault();
    //TODO: Replace with actual async calls
    setSearchFilter((state) => ({ ...state, loading: true }));
    onSearch(searchFilter, () => {
      setSearchFilter((state) => ({ ...state, loading: false }));
    });
  };

  const regionChangeHandler = (event) => {
    setSearchFilter((state) => ({ ...state, regionId: event.target.value }));
  };

  const provinceChangeHandler = (event) => {
    setSearchFilter((state) => ({ ...state, provinceId: event.target.value }));
  };

  const districtChangeHandler = (event) => {
    setSearchFilter((state) => ({ ...state, districtId: event.target.value }));
  };

  const subDistrictChangeHandler = (event) => {
    setSearchFilter((state) => ({
      ...state,
      subDistrictId: event.target.value,
    }));
  };

  const conditionChangeHandler = (event) => {
    setSearchFilter((state) => ({
      ...state,
      condition: event.target.value,
    }));
  };

  const resetFilterHandler = () => {
    setSearchFilter(initialFilters);
    onReset();
  };

  //useEffect
  useEffect(() => {
    console.log("regionid changed!!");
    setSearchFilter((state) => ({ ...state, provinceId: "" }));

    if (searchFilter.regionId) {
      fetchProvincesByRegionId(searchFilter.regionId).then((result) => {
        setProvinceList(result);
        // if (searchFilter.regionId === "r2") {
        //   setSearchFilter((state) => ({ ...state, provinceId: "p1" }));
        // } else {
        //   setSearchFilter((state) => ({ ...state, provinceId: "" }));
        // }
      });
    } else {
      setProvinceList([]);
    }
  }, [searchFilter.regionId]);

  useEffect(() => {
    console.log("provinceId changed!!");
    setSearchFilter((state) => ({ ...state, districtId: "" }));

    if (searchFilter.provinceId) {
      fetchDistrictsByProvinceId(searchFilter.provinceId).then((result) => {
        setDistrictList(result);
      });
    } else {
      setDistrictList([]);
    }
  }, [searchFilter.provinceId]);

  useEffect(() => {
    console.log("districtId changed!!");
    setSearchFilter((state) => ({ ...state, subDistrictId: "" }));

    if (searchFilter.districtId) {
      fetchSubDistrictsByDistrictId(searchFilter.districtId).then((result) => {
        setSubDistrictList(result);
      });
    } else {
      setSubDistrictList([]);
    }
  }, [searchFilter.districtId]);

  return (
    <Fragment>
      <div className="lg:max-w-7xl mx-auto my-4 p-2">
        <div className="relative bg-primary shadow-md rounded-lg overflow-hidden">
          <div className="">
            <div className="relative h-auto">
              {/* filter hero image background */}

              {/* filters content */}
              <div className="relative h-auto top-0 z-20 p-4 md:p-10">
                <div className="text-3xl text-center text-white font-bold">
                  ฉันกำลังสนใจ?
                </div>

                {/* post types */}
                <ul className="flex justify-center items-center gap-5 m-4">
                  {!searchFilter.postType && (
                    <li className="animate-bounce text-white mt-2">
                      <ArrowRightIcon className="w-6 h-6" />
                    </li>
                  )}
                  {postTypeList.map((postType) => (
                    <li
                      key={postType.id}
                      className={`bg-gray-light transition-all ease-out cursor-pointer text-gray-hard hover:scale-110 px-6 md:px-8 py-4 md:py-5 rounded-full text-sm md:text-lg font-bold select-none ${
                        postType.isActive && styles.postTypeActive
                      } ${
                        !!searchFilter.postType &&
                        !postType.isActive &&
                        styles.postTypeInActive
                      }`}
                      onClick={() => {
                        selectPostTypeHandler(postType);
                      }}
                    >
                      {postType.label}
                    </li>
                  ))}
                </ul>

                {/* asset types */}
                {searchFilter.postType && (
                  <ul className="flex justify-center items-center gap-2 lg:gap-5 mb-4">
                    {!searchFilter.assetType && (
                      <li className="animate-bounce text-white mt-2">
                        <ArrowRightIcon className="w-3 h-3 md:w-6 md:h-6" />
                      </li>
                    )}

                    {assetTypeList.map((assetType) => (
                      <li
                        key={assetType.id}
                        className={`bg-gray-light transition-all ease-out cursor-pointer text-gray-hard hover:scale-110 py-3 px-2 lg:px-5 rounded-full font-bold select-none text-xs lg:text-base ${
                          assetType.isActive && styles.assetTypeActive
                        } ${
                          !!searchFilter.assetType &&
                          !assetType.isActive &&
                          styles.assetTypeInActive
                        }`}
                        onClick={() => {
                          selectAssetTypeHandler(assetType.id);
                        }}
                      >
                        {assetType.label}
                      </li>
                    ))}
                  </ul>
                )}

                {/* form */}
                {searchFilter.assetType && (
                  <div className="relative bg-white bg-opacity-75 p-6 pt-5 rounded-md">
                    <form onSubmit={searchHandler}>
                      <div className="lg:flex">
                        <div className="lg:w-5/6">
                          {/* locations */}
                          <div className="lg:flex items-center gap-4 mb-3 space-y-4 md:space-y-0">
                            <LocationIcon className="text-gray-medium w-6 h-6 mx-auto" />

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="region"
                                label="ภาค"
                                options={regionList}
                                onChange={regionChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="province"
                                label="จังหวัด"
                                options={provinceList}
                                onChange={provinceChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="district"
                                label="เขต/อำเภอ"
                                options={districtList}
                                onChange={districtChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="subDistrict"
                                label="แขวง/ตำบล"
                                options={subDistrictList}
                                onChange={subDistrictChangeHandler}
                              />
                            </div>
                          </div>

                          {/* keywords & prices */}
                          {/* <div className="lg:flex items-center gap-4">
                            <div className="">
                              <DollarIcon className="text-gray-medium w-6 h-6 mx-auto" />
                            </div>

                            <div className="lg:w-1/4">
                              <TextInput
                                id="minPrice"
                                type="number"
                                label="ราคาต่ำสุด"
                                placeholder="0"
                                leadingSlot="$"
                                onChange={(event) => {
                                  setSearchFilter((state) => ({
                                    ...state,
                                    minPrice: +event.target.value,
                                  }));
                                }}
                              ></TextInput>
                            </div>

                            <div className="lg:w-1/4">
                              <TextInput
                                id="maxPrice"
                                type="number"
                                label="ราคาสูงสุด"
                                placeholder="0"
                                leadingSlot="$"
                                onChange={(event) => {
                                  setSearchFilter((state) => ({
                                    ...state,
                                    maxPrice: +event.target.value,
                                  }));
                                }}
                              ></TextInput>
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="condition"
                                label="รูปแบบ"
                                options={conditions}
                                onChange={conditionChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <TextInput
                                id="keyword"
                                label="คำค้นหา"
                                placeholder="ขายด่วน"
                                onChange={(event) => {
                                  setSearchFilter((state) => ({
                                    ...state,
                                    keyword: event.target.value,
                                  }));
                                }}
                              ></TextInput>
                            </div>
                          </div> */}
                        </div>

                        <div className="w-full lg:w-1/6">
                          {/* Search Button */}
                          <div className="md:flex justify-center items-end h-full w-full">
                            <div>
                              <button
                                type="submit"
                                className="inline-flex justify-center items-center w-full lg:w-32 lg:h-20 p-5 border border-transparent shadow-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xl mt-4 lg:mt-0"
                              >
                                <SearchIcon
                                  className="-ml-0.5 mr-2 h-8 w-8 animate-none"
                                  aria-hidden="true"
                                />
                                ค้นหา
                              </button>

                              <div
                                className="mt-2 md:absolute md:bottom-2 md:left-4 md:mt-0  text-accent hover:text-accent-hover text-center  text-xs italic underline cursor-pointer select-none"
                                onClick={resetFilterHandler}
                              >
                                รีเซ็ตตัวกรอง
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              {/* fff */}
            </div>
          </div>
        </div>
      </div>
      {searchFilter.loading && <Loader />}
    </Fragment>
  );
};
export default PostFilter;

// const PostFilter = () => {
//   return <h2>Filters</h2>;
// };
// export default PostFilter;
