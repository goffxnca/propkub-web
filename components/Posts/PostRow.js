import { ClockIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { getPostType } from '../../libs/mappers/postTypeMapper';
import { getAssetType } from '../../libs/mappers/assetTypeMapper';
import { formatAddress } from '../../libs/formatters/addressFomatter';
import { getPriceUnit } from '../../libs/mappers/priceUnitMapper';
import TimeAgo from 'timeago-react';

const PostRow = ({
  postType,
  assetType,
  title,
  slug,
  price,
  priceUnit,
  address,
  createdAt
}) => {
  const postLink = `/property/${slug}`;
  const postTypeFormat = getPostType(postType);
  const assetTypeFormat = getAssetType(assetType);
  const addressFormat = formatAddress(address);
  const priceUnitFormat = priceUnit ? ` / ${getPriceUnit(priceUnit)}` : '';
  const priceWithFormat = price?.toLocaleString();

  return (
    <li className="group">
      <Link href={postLink} className="block cursor-pointer">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
          {/* Badge */}
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex rounded-md bg-blue-600 py-1.5 px-3 text-xs font-semibold text-white">
              {postTypeFormat}
              {assetTypeFormat}
            </span>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <TimeAgo datetime={createdAt} locale="th" />
            </div>
          </div>

          {/* Location */}
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {addressFormat}
          </p>

          {/* Title */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {title}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 pt-3 border-t border-gray-200">
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

export default PostRow;
