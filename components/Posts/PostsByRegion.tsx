import Link from "next/link";

const PostByRegion = ({
  regionId,
  regionName,
  assetId,
  assetName,
  provinces,
}) => {
  return (
    <section className="mb-4">
      <h2 className="text-xl  tracking-tight text-gray-900 p-2">
        {assetName + regionName}
      </h2>
      <ul className="flex w-full flex-wrap">
        {provinces.map((province) => (
          <li key={province.id} className="mx-2">
            {/* lock this PostsByRegion to be type sell & location type province for now */}
            <Link
              href={`/${assetId}/spv${province.id}/${assetName}-${province.name}`}
              target="_blank"
              rel="noopener noreferrer"
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
