import { ClockIcon } from "@heroicons/react/outline";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { getPostType } from "../../libs/mappers/postTypeMapper";
import { getAssetType } from "../../libs/mappers/assetTypeMapper";
import { formatAddress } from "../../libs/formatters/addressFomatter";
import { getPriceUnit } from "../../libs/mappers/priceUnitMapper";
import TimeAgo from "timeago-react";

const PostRow = ({
  postType,
  assetType,
  title,
  slug,
  price,
  priceUnit,
  address,
  createdAt,
}) => {
  const postLink = `/property/${slug}`;
  const postTypeFormat = getPostType(postType);
  const assetTypeFormat = getAssetType(assetType);
  const addressFormat = formatAddress(address);
  const priceUnitFormat = priceUnit ? ` / ${getPriceUnit(priceUnit)}` : "";
  const priceWithFormat = price?.toLocaleString();

  return (
    <li>
      <Link
        href={postLink}
        // target="_blank"
        // rel="noopener noreferrer"
        className="block hover:bg-gray-50"
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-medium text-indigo-600">
              {title}
            </p>
            <div className="ml-2 flex flex-shrink-0">
              <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                {postTypeFormat + assetTypeFormat}
              </p>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-md text-gray-500">
                {/* <CurrencyDollarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  /> */}
                ราคา ฿{priceWithFormat} {priceUnitFormat}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <LocationMarkerIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {addressFormat}
              </p>
            </div>

            <div className="flex gap-x-10">
              {/* <div className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0">
                  <UserIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300"
                    aria-hidden="true"
                  />
                  <p>{createdBy?.name}</p>
                </div> */}

              <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                <ClockIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300"
                  aria-hidden="true"
                />
                <p>
                  <TimeAgo datetime={createdAt} locale="th" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PostRow;
