import Head from 'next/head';
import Image from 'next/image';
import { NextPage } from 'next';
import contributors from '../data/contributors.json';

type SocialLink = { platform: string; url: string };

type Contributor = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socials?: SocialLink[];
  contributions?: string[];
  featured?: boolean;
};

const contributorsList: Contributor[] =
  contributors as unknown as Contributor[];

const ContributorsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contributors — Propkub</title>
        <meta name="description" content="List of project contributors" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-center">Contributors</h1>

        <p className="text-center text-sm text-gray-600 mt-2">
          Thanks to everyone who contributes to this project.
        </p>

        <section aria-label="Contributors list" className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {contributorsList.map((c) => (
              <article
                key={c.id}
                className={`relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${
                  c.featured
                    ? 'border-2 border-indigo-500'
                    : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                {c.featured && (
                  <span
                    className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                    aria-hidden="true"
                  >
                    Featured
                  </span>
                )}
                <div className="flex items-center">
                  <Image
                    src={'/user.png'}
                    alt={`Avatar of ${c.name}`}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium truncate">{c.name}</h2>
                    <h2 className="text-lg font-medium truncate">{c.name}</h2>
                    {c.role && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {c.role}
                      </p>
                    )}
                  </div>
                </div>

                {c.bio && (
                  <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    {c.bio}
                  </p>
                )}

                {c.socials && c.socials.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.socials.map((s, idx) => (
                      <a
                        key={`${s.platform}-${idx}`}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                        aria-label={`Visit ${c.name}'s ${s.platform} profile`}
                      >
                        {s.platform}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default ContributorsPage;
