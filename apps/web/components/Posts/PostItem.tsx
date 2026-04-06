import { useMemo } from 'react';
import Link from 'next/link';
import {
  Address,
  AssetType,
  PostType,
  PriceUnit,
  Spec
} from '@/types/models/post';
import { useTranslation } from '@/hooks/useTranslation';
import { getIcon } from '@/libs/mappers/iconMapper';
import { getPriceUnit } from '@/libs/mappers/priceUnitMapper';
import { formatAddress } from '@/libs/formatters/addressFormatter';

interface PostItemProps {
  id: string;
  postType: PostType;
  assetType: AssetType;
  title: string;
  slug: string;
  thumbnail: string;
  thumbnailAlt?: string;
  price?: number;
  priceUnit?: PriceUnit;
  address: Address;
  specs: Spec[];
  isStudio?: boolean;
}

const PostItem = ({
  id,
  postType,
  assetType,
  title,
  slug,
  thumbnail,
  thumbnailAlt,
  price,
  priceUnit,
  address,
  specs,
  isStudio
}: PostItemProps) => {
  const { t } = useTranslation('posts');
  const { t: tCommon } = useTranslation('common');
  const priceWithFormat = useMemo(() => price?.toLocaleString(), [price]);

  const studioSpec = useMemo(
    () =>
      isStudio
        ? [
            {
              id: 'studio',
              label: t('fields.isStudio'),
              icon: getIcon('studio')
            }
          ]
        : [],
    [isStudio, t]
  );

  const specsFormat = useMemo(
    () =>
      studioSpec
        .concat(
          specs.map((spec) => ({
            ...spec,
            label: `${spec.value} ${spec.label}`,
            icon: getIcon(spec.id)
          }))
        )
        .slice(0, 3),
    [specs, studioSpec]
  );

  const postLink = useMemo(() => `/property/${slug}`, [slug]);
  const badgeLabel = useMemo(
    () =>
      t('card.badge', {
        postType: t(`postTypes.${postType}`),
        assetType: t(`assetTypes.${assetType}`)
      }),
    [postType, assetType, t]
  );
  const priceUnitFormat = useMemo(() => {
    if (!priceUnit) return '';
    const label = getPriceUnit(priceUnit, tCommon);
    return label ? ` / ${label}` : '';
  }, [priceUnit, tCommon]);
  const addressFormat = useMemo(() => formatAddress(address), [address]);

  return (
    <li className="group">
      <Link href={postLink} className="block cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-3">
          {/* Badge */}
          <span className="absolute top-3 left-0 rounded-r-lg bg-white/95 backdrop-blur-sm py-1.5 px-3 text-xs font-semibold text-gray-700 z-20 shadow-sm">
            {badgeLabel}
          </span>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={thumbnailAlt}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="px-1">
          {/* Location */}
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-semibold text-gray-900 truncate flex-1">
              {addressFormat}
            </p>
          </div>

          {/* Title */}
          <p className="text-sm text-gray-600 truncate mb-2 leading-relaxed">
            {title}
          </p>

          {/* Specs */}
          {specsFormat.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              {specsFormat.map((spec, index) => (
                <span key={spec.id}>
                  {spec.label}
                  {index < specsFormat.length - 1 && ' · '}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold text-gray-900">
              ฿{priceWithFormat}
            </span>
            {priceUnitFormat && (
              <span className="text-sm text-gray-500 font-medium">
                {priceUnitFormat}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PostItem;
