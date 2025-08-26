import { useRouter } from 'next/router';

import { getAssetType } from '../../libs/mappers/assetTypeMapper';
import { getPostType } from '../../libs/mappers/postTypeMapper';
import PostStatusBadge from '../Posts/PostStatusBadge/PostStatusBadge';

import PageTitle from '../UI/Private/PageTitle';
import Button from '../UI/Public/Button';
import DataTable from '../UI/Public/DataTable/DataTable';
import Stats from './Stats';
import Modal from '../UI/Public/Modal';
import { SearchIcon, ExclamationIcon } from '@heroicons/react/outline';

import { useState, useEffect } from 'react';
import { getMyPosts, getMyPostsStats } from '../../libs/post-utils';
import usePagination from '../../hooks/usePagination';
import Pagination from '../UI/Public/Pagination';
import Loader from '../UI/Common/modals/Loader';
import Link from 'next/link';

const MyPropertyList = () => {
  const router = useRouter();
  const {
    data: myPosts,
    loading,
    error,
    page,
    perPage,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage
  } = usePagination(getMyPosts, 10);

  const [apiError, setApiError] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalPostViews: 0,
    totalPhoneViews: 0,
    totalLineViews: 0,
    totalShares: 0,
    totalPins: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const statsData = await getMyPostsStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setApiError('เกิดข้อผิดพลาดในการโหลดข้อมูลสถิติ');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Update apiError when pagination hook has an error
  useEffect(() => {
    if (error) {
      setApiError(error);
    }
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <PageTitle label="แดชบอร์ด" />

      <Stats
        totalCount={stats.totalPosts}
        totalPostViews={stats.totalPostViews}
        totalPhoneViews={stats.totalPhoneViews}
        totalLineViews={stats.totalLineViews}
        totalShares={stats.totalShares}
        totalPins={stats.totalPins}
      />

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              ประกาศทั้งหมด
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                router.push('/account/posts/create');
              }}
            >
              ลงประกาศ
            </Button>
          </div>
        </div>

        <DataTable
          items={myPosts}
          columns={[
            {
              title: '',
              field: 'view',
              custom: (item) => (
                <Link
                  href={`/account/posts/${item._id}`}
                  className="text-primary text-xs hover:text-primary-hover hover:underline"
                >
                  <SearchIcon className="w-4 h-4" />
                </Link>
              )
            },
            { title: 'เลขประกาศ', field: 'postNumber' },
            // { title: "#", field: "cid" },
            {
              title: 'ลงวันที่',
              field: 'createdAt',
              resolver: (item) =>
                new Date(item.createdAt).toLocaleDateString('th-TH')
            },
            {
              title: 'รูปภาพ',
              field: 'image',
              custom: (item) => (
                <div className="h-12 w-12 ">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-12 w-12 object-cover rounded-sm"
                  />
                </div>
              )
            },
            {
              title: 'สถานะ',
              field: 'status',
              custom: (item) => <PostStatusBadge status={item.status} />
            },
            {
              title: 'ประเภท',
              field: 'assetType',
              resolver: (item) => getAssetType(item.assetType)
            },

            {
              title: 'สำหรับ',
              field: 'postType',
              resolver: (item) => getPostType(item.postType)
            },
            {
              title: 'จังหวัด',
              field: 'address.provinceId',
              resolver: (item) => item.address.provinceLabel
            },
            { title: 'หัวข้อประกาศ', field: 'title' },
            {
              title: 'เข้าชม',
              field: 'postViews',
              resolver: (item) => item.stats.views.post || 0
            },
            {
              title: 'ดูเบอร์',
              field: 'phoneViews',
              resolver: (item) => item.stats.views.phone || 0
            },
            {
              title: 'ดูไลน์',
              field: 'lineViews',
              resolver: (item) => item.stats.views.line || 0
            },
            {
              title: 'แชร์',
              field: 'shares',
              resolver: (item) => item.stats.shares || 0
            },
            {
              title: 'บันทึก',
              field: 'pins',
              resolver: (item) => item.stats.pins || 0
            }
          ]}
          onRowClick={(rowId) => {
            router.push(`/account/posts/${rowId}`);
          }}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          totalCount={totalCount}
          perPage={perPage}
        />
      </div>

      {(loading || statsLoading) && <Loader />}

      <Modal
        visible={!!apiError}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={apiError}
        buttonCaption="ตกลง"
        onClose={() => {
          setApiError('');
        }}
      />
    </div>
  );
};

export default MyPropertyList;
