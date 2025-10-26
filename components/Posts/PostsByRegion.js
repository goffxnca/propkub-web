import Link from 'next/link';
import { useRouter } from 'next/router';

const PostByRegion = ({
  regionId,
  regionName,
  assetId,
  assetName,
  provinces
}) => {
  const router = useRouter();
  const { locale } = router;

  return (
    <section className="mb-4">
      <h2 className="text-xl  tracking-tight text-gray-900 p-2">
        {`${assetName}${locale === 'en' ? ' in ' : ''}${regionName}`}
      </h2>
      <ul className="flex w-full flex-wrap">
        {provinces.map((province) => (
          <li key={province.id} className="mx-2">
            <Link
              href={`/${assetId}/spv${province.id}/${assetName}-${province.name}`}
              // target="_blank"
              // rel="noopener noreferrer"
              className="text-gray-500"
            >
              <h3>{province.name}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PostByRegion;
