import { getIcon } from '../../libs/mappers/iconMapper';
import { getPriceUnit } from '../../libs/mappers/priceUnitMapper';
import { getPostType } from '../../libs/mappers/postTypeMapper';
import { getAssetType } from '../../libs/mappers/assetTypeMapper';
import { formatAddress } from '../../libs/formatters/addressFomatter';
import { useMemo } from 'react';
import Link from 'next/link';

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
}) => {
  const priceWithFormat = useMemo(() => price?.toLocaleString(), [price]);

  const studioSpec = useMemo(
    () =>
      isStudio
        ? [
            {
              id: 'studio',
              label: 'ห้องสตูดิโอ',
              icon: getIcon('studio')
            }
          ]
        : [],
    [isStudio]
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
  const postTypeFormat = useMemo(() => getPostType(postType), [postType]);
  const assetTypeFormat = useMemo(() => getAssetType(assetType), [assetType]);
  const priceUnitFormat = useMemo(
    () => (priceUnit ? ` / ${getPriceUnit(priceUnit)}` : ''),
    [priceUnit]
  );
  const addressFormat = useMemo(() => formatAddress(address), [address]);

  return (
    <li className="group">
      <Link href={postLink} className="block cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-3">
          {/* Badge */}
          <span className="absolute top-3 left-0 rounded-r-lg bg-white/95 backdrop-blur-sm py-1.5 px-3 text-xs font-semibold text-gray-700 z-20 shadow-sm">
            {postTypeFormat}
            {assetTypeFormat}
          </span>

          {/* Image */}
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
            <p className="text-sm font-semibold text-gray-800 truncate flex-1">
              {addressFormat}
            </p>
          </div>

          {/* Title */}
          <p className="text-sm text-gray-600 truncate mb-2">{title}</p>

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
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-gray-900">
              ฿{priceWithFormat}
            </span>
            {priceUnitFormat && (
              <span className="text-sm text-gray-600">{priceUnitFormat}</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PostItem;
