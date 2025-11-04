import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/useTranslation';

import PostStatusBadge from '../Posts/PostStatusBadge/PostStatusBadge';

import PageTitle from '../UI/PageTitle';
import Button from '../UI/Button';
import DataTable from '../UI/DataTable';
import Stats from './Stats';
import Modal from '../UI/Modal';
import { SearchIcon, ExclamationIcon } from '@heroicons/react/outline';

import { useState, useEffect } from 'react';
import { getMyPosts, getMyPostsStats } from '../../libs/post-utils';
import usePagination from '../../hooks/usePagination';
import Pagination from '../UI/Pagination';
import Loader from '../UI/Common/modals/Loader';
import Link from 'next/link';
import type { Post } from '../../types/models/post';
import type { PostStatsResponse } from '../../types/dtos/responses/postStatsResponse';

const MyPostList = () => {
  const router = useRouter();
  const { t } = useTranslation('posts');
  const { t: tDashboard } = useTranslation('pages/dashboard');
  const { t: tCommon } = useTranslation('common');
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
  const [stats, setStats] = useState<PostStatsResponse>({
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
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        setApiError(tCommon('error.generic.description'));
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update apiError when pagination hook has an error
  useEffect(() => {
    if (error) {
      setApiError(error);
    }
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <PageTitle label={tDashboard('title')} />

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
              {tDashboard('allPosts')}
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
              {tDashboard('createPost')}
            </Button>
          </div>
        </div>

        <DataTable<Post>
          items={myPosts as Post[]}
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
            { title: t('fields.postNumber'), field: 'postNumber' },
            // { title: "#", field: "cid" },
            {
              title: t('fields.createdAt'),
              field: 'createdAt',
              resolver: (item) =>
                new Date(item.createdAt).toLocaleDateString('th-TH')
            },
            {
              title: t('fields.images'),
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
              title: t('fields.status'),
              field: 'status',
              custom: (item) => <PostStatusBadge status={item.status} />
            },
            {
              title: t('fields.assetType'),
              field: 'assetType',
              resolver: (item) => t(`assetTypes.${item.assetType}`)
            },

            {
              title: t('fields.postTypeAlt'),
              field: 'postType',
              resolver: (item) => t(`postTypes.${item.postType}`)
            },
            {
              title: t('fields.address.provinceLabel'),
              field: 'address.provinceId',
              resolver: (item) => item.address.provinceLabel
            },
            { title: t('fields.title'), field: 'title' },
            {
              title: t('fields.stats.views.post'),
              field: 'postViews',
              resolver: (item) => item.stats.views.post || 0
            },
            {
              title: t('fields.stats.views.phone'),
              field: 'phoneViews',
              resolver: (item) => item.stats.views.phone || 0
            },
            {
              title: t('fields.stats.views.line'),
              field: 'lineViews',
              resolver: (item) => item.stats.views.line || 0
            },
            {
              title: t('fields.stats.shares'),
              field: 'shares',
              resolver: (item) => item.stats.shares || 0
            },
            {
              title: t('fields.stats.pins'),
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
        title={tCommon('error.generic.title')}
        desc={apiError}
        buttonCaption={tCommon('buttons.ok')}
        onClose={() => {
          setApiError('');
        }}
      />
    </div>
  );
};

export default MyPostList;
