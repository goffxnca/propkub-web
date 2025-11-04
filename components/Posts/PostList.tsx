import { useMemo, useState, useEffect } from 'react';

import { animateScroll, Element, scroller } from 'react-scroll';

import { ExclamationIcon } from '@heroicons/react/outline';
import { Post } from '@/types/models/post';
import { Province } from '@/types/models/address';
import { useTranslation } from '@/hooks/useTranslation';
import { cleanObject } from '@/libs/object-utils';
import { queryPostWithFilters } from '@/libs/post-utils';
import PostFilter from './PostFilter';
import PostItem from './PostItem';
import PostRow from './PostRow';
import PostsByRegion from './PostsByRegion';
import Modal from '../UI/Modal';

interface PostType {
  id: string;
  label?: string;
  searchFor?: string;
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

interface PostListProps {
  posts: Post[];
  provinces: Province[];
  hasError: boolean;
}

const PostList = ({ posts, provinces, hasError }: PostListProps) => {
  const { t } = useTranslation('posts');
  const [searchCount, setSearchCount] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [localError, setLocalError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(hasError);

  useEffect(() => {
    if (hasError || localError) {
      setShowErrorModal(true);
    }
  }, [hasError, localError]);

  const searchHandler = async (
    filters: SearchFilter,
    onDone: () => void
  ): Promise<void> => {
    try {
      const { postType } = filters;
      const cleanFilters = cleanObject({
        ...filters,
        postType: postType?.searchFor
      }) as any;
      const results = await queryPostWithFilters(cleanFilters);
      setFilteredPosts(results as Post[]);
      setSearchCount((prevSearchCount) => prevSearchCount + 1);
      scroller.scrollTo('searchResult', {
        smooth: true
      });
      onDone();
    } catch (error: any) {
      console.error('Failed to search posts:', error);
      setLocalError(true);
      onDone();
    }
  };

  const resetHandler = () => {
    setSearchCount(0);
    setLocalError(false);
    setShowErrorModal(false);
    animateScroll.scrollToTop({ duration: 500 });
  };

  const filteredPostList = useMemo(() => {
    return searchCount === 0 ? posts : filteredPosts;
  }, [searchCount, filteredPosts, posts]);

  const listHeadingLabel = useMemo(() => {
    return searchCount > 0
      ? t('list.searchResults', { count: filteredPosts.length })
      : t('list.latestPosts');
  }, [searchCount, filteredPosts, t]);

  return (
    <div className="lg:max-w-7xl mx-auto">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-500 p-2 text-center">
        {t('list.pageTitle')}
      </h1>

      <PostFilter onSearch={searchHandler} onReset={resetHandler} />

      {/* Search Results */}
      <div>
        <Element name="searchResult">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-700 p-2">
            {listHeadingLabel}
          </h2>
        </Element>

        {/* 30 Recent posts with thumbnail */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 px-4">
          {filteredPostList.slice(0, 30).map((post, index) => (
            <PostItem
              key={post._id}
              id={post._id}
              postType={post.postType}
              assetType={post.assetType}
              title={post.title}
              slug={post.slug}
              thumbnail={post.thumbnail}
              price={post.price}
              priceUnit={post.priceUnit}
              address={post.address}
              specs={post.specs}
              isStudio={post.isStudio}
            />
          ))}
        </ul>

        {/* Recent 31-50 posts without thumbnail */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 px-4">
          {filteredPostList.slice(30, 50).map((post, index) => (
            <PostRow
              key={post._id}
              postType={post.postType}
              assetType={post.assetType}
              title={post.title}
              slug={post.slug}
              price={post.price}
              priceUnit={post.priceUnit}
              address={post.address}
              createdAt={post.createdAt}
            />
          ))}
        </ul>

        <PostsByRegion
          regionId={'r1'}
          regionName={t('regions.r1')}
          assetId={'land'}
          assetName={t('byRegion.sellLand')}
          provinces={provinces.filter((p) => p.regionId === 'r1')}
        />

        <PostsByRegion
          regionId={'r2'}
          regionName={t('regions.r2')}
          assetId={'land'}
          assetName={t('byRegion.sellLand')}
          provinces={provinces.filter((p) => p.regionId === 'r2')}
        />

        <PostsByRegion
          regionId={'r3'}
          regionName={t('regions.r3')}
          assetId={'land'}
          assetName={t('byRegion.sellLand')}
          provinces={provinces.filter((p) => p.regionId === 'r3')}
        />

        <PostsByRegion
          regionId={'r4'}
          regionName={t('regions.r4')}
          assetId={'land'}
          assetName={t('byRegion.sellLand')}
          provinces={provinces.filter((p) => p.regionId === 'r4')}
        />

        <PostsByRegion
          regionId={'r5'}
          regionName={t('regions.r5')}
          assetId={'land'}
          assetName={t('byRegion.sellLand')}
          provinces={provinces.filter((p) => p.regionId === 'r5')}
        />

        <PostsByRegion
          regionId={'r6'}
          regionName={t('regions.r6')}
          assetId={'land'}
          assetName={t('byRegion.sellLand')}
          provinces={provinces.filter((p) => p.regionId === 'r6')}
        />
      </div>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        type="warning"
        title={t('list.error.title')}
        desc={t('list.error.description')}
        buttonCaption={t('list.error.button')}
        Icon={ExclamationIcon}
        onClose={() => {
          setShowErrorModal(false);
          setLocalError(false);
        }}
      />
    </div>
  );
};

export default PostList;
