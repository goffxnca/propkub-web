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
    <li className="group h-full">
      <Link href={postLink} className="block cursor-pointer h-full">
        <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700">
              {postTypeFormat}{assetTypeFormat}
            </span>
            <div className="flex items-center text-xs text-gray-400 gap-1">
              <ClockIcon className="w-3 h-3" />
              <TimeAgo datetime={createdAt} locale="th" />
            </div>
          </div>

          <p className="text-sm font-medium text-gray-500 mb-1">
            {addressFormat}
          </p>

          <p className="text-base text-gray-900 mb-3 line-clamp-2 leading-relaxed flex-grow">
            {title}
          </p>

          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-lg font-semibold text-gray-900">
              ฿{priceWithFormat}
            </span>
            {priceUnitFormat && (
              <span className="text-sm text-gray-500">
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
