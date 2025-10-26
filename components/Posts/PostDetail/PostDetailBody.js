import { getIcon } from '../../../libs/mappers/iconMapper';
import { getPriceUnit } from '../../../libs/mappers/priceUnitMapper';
import { useTranslation } from '../../../hooks/useTranslation';
import { useMemo } from 'react';
import Heading from '../../UI/Public/Heading';
import LineBreak from '../../UI/Public/LineBreak';
import PostMap from '../PostMap';
import SizeIcon from '../../Icons/SizeIcon';
import SpecItem from '../Specs/SpecItem';
import LocationIcon from '../../Icons/LocationIcon';
import { formatAddressFull } from '../../../libs/formatters/addressFomatter';
import YoutubeIframe from '../../UI/Public/YoutubeIframe';
import { getAreaUnitLabel } from '../../../libs/mappers/areaUnitMapper';
import sanitizeHtml from 'sanitize-html';
import { getPostTypeLabel } from '../../../libs/mappers/postTypeMapper';
import { getConditionLabel } from '../../../libs/mappers/conditionMapper';
import { ChartBarIcon } from '@heroicons/react/outline';
import { SANITIZE_OPTIONS } from '../../../libs/constants';
import { getLocalDateByISODateString } from '../../../libs/date-utils';
import { useRouter } from 'next/router';

const PostDetailBody = ({ post, postViews, images }) => {
  const { t } = useTranslation('posts');
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale;

  const studioSpec = post?.isStudio
    ? [
        {
          id: 'studio',
          label: t('fields.isStudio'),
          icon: getIcon('studio')
        }
      ]
    : [];

  const specsFormat = studioSpec.concat(
    post?.specs.map((spec) => ({
      ...spec,
      label: `${spec.value} ${spec.label}`,
      icon: getIcon(spec.id)
    }))
  );

  const facilitiesFormat = post?.facilities.map((facility) => ({
    ...facility,
    label: facility.label,
    icon: getIcon(facility.id)
  }));

  const priceWithFormat = post?.price?.toLocaleString();

  const forRent = post.postType === 'rent';
  const isLand = post.assetType === 'land';

  const priceUnitFormat =
    forRent || isLand ? ' / ' + getPriceUnit(post.priceUnit, tCommon) : '';

  const addressFormat = formatAddressFull(post.address);

  const purifiedDescInfo = useMemo(
    () => sanitizeHtml(post.desc, SANITIZE_OPTIONS),
    [post.desc]
  );

  const postType = getPostTypeLabel(post.postType, locale, true);

  const condition = getConditionLabel(post.condition, locale);

  const badgeLabel = t('card.badge', {
    postType: t(`postTypes.${post.postType}`),
    assetType: t(`assetTypes.${post.assetType}`)
  });

  return (
    <div className="">
      <div className="space-y-2 md:mb-6 md:flex items-center justify-between ">
        <div className="flex items-center">
          <span className="text-gray-700 text-xl mr-1">{postType}</span>
          <span className="text-primary font-bold text-3xl">
            {priceWithFormat}
          </span>
          <span className="text-gray-700 text-xl ml-1">฿{priceUnitFormat}</span>
        </div>

        <div>
          <ul className="md:flex md:flex-wrap w-full gap-x-4">
            {post.area > 0 && (
              <SpecItem
                className=""
                Icon={SizeIcon}
                label={`${t('fields.area')} ${post.area} ${getAreaUnitLabel(post.areaUnit, locale)}`}
              />
            )}

            {post.land > 0 && (
              <SpecItem
                className=""
                Icon={SizeIcon}
                label={`${t('fields.land')} ${post.land} ${getAreaUnitLabel(post.landUnit, locale)}`}
              />
            )}
          </ul>
        </div>
      </div>

      <>
        <LineBreak />
        <div>
          <Heading size="2" label={t('sections.basicInfo')} />
          <div className="md:flex md:flex-wrap text-gray-700">
            <div className="md:w-1/2">
              {t('details.type')}: {badgeLabel}
            </div>
            {condition && (
              <div className="md:w-1/2">
                {t('fields.condition')}: {condition}
              </div>
            )}
            <div className="md:w-1/2">
              {t('fields.postNumber')}: {post.postNumber}
            </div>
            {post.refId && (
              <div className="md:w-1/2">
                {t('fields.refId')}: {post.refId}
              </div>
            )}
            <div className="md:w-1/2">
              {t('details.createdAt')}:{' '}
              {getLocalDateByISODateString(post.createdAt)}
            </div>
            {post.updatedAt && (
              <div className="md:w-1/2">
                {t('details.updatedAt')}:{' '}
                {getLocalDateByISODateString(post.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </>

      {specsFormat.length > 0 && (
        <>
          <LineBreak />
          <div>
            <Heading size="2" label={t('sections.specs')} />
            <div>
              <ul className="flex flex-wrap w-full gap-y-4">
                {specsFormat?.map((spec) => (
                  <SpecItem
                    className="w-1/2"
                    key={spec.id}
                    Icon={spec.icon}
                    label={spec.label}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      <LineBreak />
      <div className="wysiwyg-content">
        <Heading size="2" label={t('sections.details')} />
        <div
          className="text-gray-700 break-words"
          dangerouslySetInnerHTML={{ __html: purifiedDescInfo }}
        />
      </div>

      {facilitiesFormat.length > 0 && (
        <>
          <LineBreak />
          <div>
            <Heading size="2" label={t('fields.facilities')} />
            <div>
              <ul className="flex flex-wrap w-full gap-y-4">
                {facilitiesFormat?.map((facility) => (
                  <SpecItem
                    className="w-1/2"
                    key={facility.label}
                    Icon={facility.icon}
                    label={facility.label}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {post.video && (
        <>
          <LineBreak />
          <div>
            <Heading size="2" label={t('sections.video')} />
            <YoutubeIframe youtubeUrl={post.video} />
          </div>
        </>
      )}

      <LineBreak />
      <div>
        <Heading size="2" label={t('sections.location')} />

        <address className="not-italic">
          <div className="flex items-center">
            <LocationIcon className="text-gray-soft" />
            <p className="ml-2">{addressFormat}</p>
          </div>
        </address>
        <PostMap
          lat={post?.address?.location?.lat}
          lng={post?.address?.location?.lng}
        />

        {/* {post?.address?.location?.h >= 0 && ( */}
        {true && (
          <>
            <span className="text-sm text-gray-500">
              {t('details.streetviewNote')}
            </span>
            <PostMap
              mode="streetview"
              lat={post?.address?.location?.lat}
              lng={post?.address?.location?.lng}
              heading={post?.address?.location?.h}
            />
          </>
        )}
      </div>

      <LineBreak />
      <div className="wysiwyg-content">
        <Heading size="2" label={t('sections.images')} />
        <div className="">
          {images.map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={image.original}
              className="mx-auto mt-2"
              alt=""
            ></img>
          ))}
        </div>
      </div>

      <LineBreak />
      <div>
        {/* <Heading size="2" label="อื่นๆ" /> */}
        <div className="flex gap-y-2 flex-wrap justify-between">
          <div className="flex items-center text-gray-500">
            <ChartBarIcon className="w-5 h-5" />

            <p className="text-base font-medium ml-1">
              {t('details.views')} ({postViews || 0})
            </p>
          </div>

          {/* <div className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer w-1/2">
            <InformationCircleIcon className="w-5 h-5" />
            <p className="text-base font-medium ml-1">รายงานประกาศ</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PostDetailBody;
