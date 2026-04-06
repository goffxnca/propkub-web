import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  FormEventHandler,
  ChangeEventHandler
} from 'react';
import styles from './PostFilter.module.css';

import orderby from 'lodash.orderby';

import { SearchIcon, ArrowRightIcon } from '@heroicons/react/solid';

import { useRouter } from 'next/router';
import { useTranslation } from '@/hooks/useTranslation';
import { District, Province, SubDistrict } from '@/types/models/address';
import { getAssetTypes } from '@/libs/mappers/assetTypeMapper';
import { Locale } from '@/types/locale';
import { AssetType } from '@/types/misc/assetType';
import {
  fetchDistrictsByProvinceId,
  fetchProvincesByRegionId,
  fetchSubDistrictsByDistrictId
} from '@/libs/managers/addressManager';
import LocationIcon from '../Icons/LocationIcon';
import SelectInput from '../UI/Inputs/SelectInput';
import Loader from '../UI/Common/modals/Loader';
import regions from '../../data/regions.json';

interface Region {
  id: string;
  name: string;
}

interface PostType {
  id: string;
  label?: string;
  searchFor?: string;
  isActive?: boolean;
}

interface SearchFilter {
  postType: PostType | null;
  assetType: string;
  regionId: string;
  provinceId: string;
  districtId: string;
  subDistrictId: string;
  loading: boolean;
}

interface PostFilterProps {
  onSearch: (filter: SearchFilter, callback: () => void) => void;
  onReset: () => void;
}

const initialFilters: SearchFilter = {
  postType: null,
  assetType: '',
  regionId: '',
  provinceId: '',
  districtId: '',
  subDistrictId: '',
  loading: false
};

const PostFilter = ({ onSearch, onReset }: PostFilterProps) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('posts');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    ...initialFilters
  });

  const postTypes: PostType[] = [
    { id: 'rent', label: t('filter.actions.rent'), searchFor: 'rent' },
    { id: 'buy', label: t('filter.actions.buy'), searchFor: 'sale' },
    { id: 'sale', label: t('filter.actions.sale') }
  ];

  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [subDistrictList, setSubDistrictList] = useState<SubDistrict[]>([]);

  //computed
  const postTypeList = postTypes.map((postType) => ({
    ...postType,
    isActive: searchFilter.postType?.id === postType.id
  }));

  const assetTypeList = getAssetTypes(locale as Locale).map(
    (assetType: AssetType) => ({
      ...assetType,
      label: t(`assetTypes.${assetType.id}`),
      isActive: searchFilter.assetType === assetType.id
    })
  );

  const regionList = useMemo(
    () => orderby(regions as Region[], 'name', 'asc'),
    []
  );

  //handlers
  const selectPostTypeHandler = (postType: PostType) => {
    if (postType.id !== searchFilter.postType?.id) {
      if (postType.id === 'sale') {
        router.push('/login');
      } else {
        setSearchFilter((state) => ({
          ...state,
          postType: { id: postType.id, searchFor: postType.searchFor },
          assetType: ''
        }));
      }
    }
  };

  const selectAssetTypeHandler = (assetType: string) => {
    setSearchFilter((state) => ({ ...state, assetType: assetType }));
  };

  const searchHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    setSearchFilter((state) => ({ ...state, loading: true }));
    onSearch(searchFilter, () => {
      setSearchFilter((state) => ({ ...state, loading: false }));
    });
  };

  const regionChangeHandler: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setSearchFilter((state) => ({ ...state, regionId: event.target.value }));
  };

  const provinceChangeHandler: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setSearchFilter((state) => ({ ...state, provinceId: event.target.value }));
  };

  const districtChangeHandler: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setSearchFilter((state) => ({ ...state, districtId: event.target.value }));
  };

  const subDistrictChangeHandler: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setSearchFilter((state) => ({
      ...state,
      subDistrictId: event.target.value
    }));
  };

  const resetFilterHandler = () => {
    setSearchFilter(initialFilters);
    onReset();
  };

  //useEffect
  useEffect(() => {
    setSearchFilter((state) => ({ ...state, provinceId: '' }));

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
    setSearchFilter((state) => ({ ...state, districtId: '' }));

    if (searchFilter.provinceId) {
      fetchDistrictsByProvinceId(searchFilter.provinceId).then((result) => {
        setDistrictList(result);
      });
    } else {
      setDistrictList([]);
    }
  }, [searchFilter.provinceId]);

  useEffect(() => {
    setSearchFilter((state) => ({ ...state, subDistrictId: '' }));

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
                  {t('filter.title')}
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
                                label={t('filter.location.region')}
                                options={regionList}
                                onChange={regionChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="province"
                                label={t('filter.location.province')}
                                options={provinceList}
                                onChange={provinceChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="district"
                                label={t('filter.location.district')}
                                options={districtList}
                                onChange={districtChangeHandler}
                              />
                            </div>

                            <div className="lg:w-1/4">
                              <SelectInput
                                id="subDistrict"
                                label={t('filter.location.subDistrict')}
                                options={subDistrictList}
                                onChange={subDistrictChangeHandler}
                              />
                            </div>
                          </div>
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
                                {t('filter.search')}
                              </button>

                              <div
                                className="mt-2 md:absolute md:bottom-2 md:left-4 md:mt-0  text-accent hover:text-accent-hover text-center  text-xs italic underline cursor-pointer select-none"
                                onClick={resetFilterHandler}
                              >
                                {t('filter.reset')}
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
