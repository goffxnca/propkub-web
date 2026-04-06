import { HomeIcon } from '@heroicons/react/solid';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav
      className="flex border-b border-gray-200 bg-white"
      aria-label="Breadcrumb"
    >
      <ol
        role="list"
        className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8"
      >
        <li className="flex">
          <div className="flex items-center">
            <Link href={'/'} className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <a
                href={page.href}
                className={`ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 ${
                  page.current && 'pointer-events-none text-gray-400'
                }`}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
