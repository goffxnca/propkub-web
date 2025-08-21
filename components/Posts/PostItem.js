import { getIcon } from "../../libs/mappers/iconMapper";
import { getPriceUnit } from "../../libs/mappers/priceUnitMapper";
import { getPostType } from "../../libs/mappers/postTypeMapper";
import { getAssetType } from "../../libs/mappers/assetTypeMapper";
import { formatAddress } from "../../libs/formatters/addressFomatter";
import LocationIcon from "../Icons/LocationIcon";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SpecItemWithCircle from "./Specs/SpecItemWithCircle";

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
  isStudio,
}) => {
  const priceWithFormat = useMemo(() => price?.toLocaleString(), [price]);

  const studioSpec = useMemo(
    () =>
      isStudio
        ? [
            {
              id: "studio",
              label: "ห้องสตูดิโอ",
              icon: getIcon("studio"),
            },
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
            icon: getIcon(spec.id),
          }))
        )
        .slice(0, 3),
    [specs, studioSpec]
  );

  const postLink = useMemo(() => `/property/${slug}`, [slug]);
  const postTypeFormat = useMemo(() => getPostType(postType), [postType]);
  const assetTypeFormat = useMemo(() => getAssetType(assetType), [assetType]);
  const priceUnitFormat = useMemo(
    () => (priceUnit ? ` / ${getPriceUnit(priceUnit)}` : ""),
    [priceUnit]
  );
  const addressFormat = useMemo(() => formatAddress(address), [address]);

  return (
    <li className="w-full lg:w-1/2 p-2 group">
      <Link
        href={postLink}
        // target="_blank"
        // rel="noopener noreferrer"
        className="md:flex rounded-md bg-white shadow-md cursor-pointer transition-all group-hover:shadow-xl group-hover:bg-gray-50"
      >
        <div className="md:w-2/5 h-64 md:h-48 overflow-hidden rounded-md rounded-t-md md:rounded-none md:rounded-l-md relative">
          <span className="absolute top-2 rounded-r-full bg-gray-lighter py-0.5 px-2 text-sm text-gray-hard z-20 shadow-md">
            {postTypeFormat + assetTypeFormat}
          </span>
          {/* <Image
              src={thumbnail}
              alt={thumbnailAlt}
              className="w-full h-full object-center object-cover transition-all ease-linear group-hover:scale-125 z-10 rounded-md md:rounded-none"
              width={250}
              height={192}
              layout="responsive"
            /> */}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={thumbnailAlt}
            className="w-full h-full object-center object-cover transition-all ease-linear group-hover:scale-125 z-10 rounded-md md:rounded-none"
          ></img>
        </div>

        <div className="md:w-3/5 p-2 md:relative">
          <h3 className="text-gray-harder mb-2 overflow-x-hidden">{title}</h3>

          <div className="md:absolute bottom-0 left-0 right-0">
            <ul className="flex mb-2 ml-2">
              {specsFormat.map((spec) => (
                <SpecItemWithCircle
                  key={spec.id}
                  Icon={spec.icon}
                  label={spec.label}
                />
              ))}
            </ul>

            <div className="border-t border-solid border-l-gray-light pl-2 pt-2 md:py-2">
              <div className="flex items-center justify-between">
                <div className="text-primary mr-2">
                  <span className="text-xl font-bold">฿{priceWithFormat}</span>
                  <span className="text-sm">{priceUnitFormat}</span>
                </div>

                <address className="not-italic">
                  <SpecItemWithCircle
                    Icon={LocationIcon}
                    label={addressFormat}
                    circle={false}
                  />
                </address>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PostItem;
