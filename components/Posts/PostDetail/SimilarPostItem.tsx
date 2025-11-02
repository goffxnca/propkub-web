import Link from 'next/link';
import { useMemo } from 'react';
import { getPriceUnit } from '../../../libs/mappers/priceUnitMapper';
import { useTranslation } from '../../../hooks/useTranslation';
import type {
  PostType,
  AssetType,
  Condition,
  Address,
  Spec,
  PriceUnit
} from '../../../types/models/post';

interface SimilarPostItemProps {
  id: string;
  postType: PostType;
  assetType: AssetType;
  condition?: Condition;
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

const SimilarPostItem = ({
  id,
  postType,
  assetType,
  condition,
  title,
  slug,
  thumbnail,
  thumbnailAlt,
  price,
  priceUnit,
  address,
  specs,
  isStudio
}: SimilarPostItemProps) => {
  const { t } = useTranslation('posts');
  const { t: tCommon } = useTranslation('common');
  const priceWithFormat = useMemo(() => price?.toLocaleString(), [price]);

  const postLink = useMemo(() => `/property/${slug}`, [slug]);

  const badgeLabel = t('card.badge', {
    postType: t(`postTypes.${postType}`),
    assetType: t(`assetTypes.${assetType}`)
  });

  const priceUnitFormat = useMemo(
    () => (priceUnit ? ` / ${getPriceUnit(priceUnit, tCommon)}` : ''),
    [priceUnit, tCommon]
  );

  return (
    <li className="w-1/2 p-2 group">
      <Link
        href={postLink}
        // target="_blank"
        // rel="noopener noreferrer"
        className=" bg-white shadow-md cursor-pointer transition-all group-hover:shadow-xl group-hover:bg-gray-50"
      >
        <div className="relative w-full overflow-hidden rounded-md ">
          <span className="absolute top-1 bg-gray-lighter py-0.5 px-2 text-sm text-gray-hard z-20 shadow-md rounded-r-md">
            {badgeLabel}
          </span>
          {/* <Image
              src={thumbnail}
              alt={thumbnailAlt}
              className="w-full h-full object-center object-cover transition-all ease-linear group-hover:scale-125 z-10 rounded-md group-hover:rounded-md"
              width={250}
              height={192}
              layout="responsive"
            /> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={thumbnailAlt}
            className="w-[200px] h-[150px] object-center object-cover transition-all ease-linear group-hover:scale-125 z-10 rounded-md group-hover:rounded-md"
          ></img>
          <div className="right-0 bottom-0 text-primary z-10">
            <span className="text-md">฿{priceWithFormat}</span>
            <span className="text-sm">{priceUnitFormat}</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SimilarPostItem;
