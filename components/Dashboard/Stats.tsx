import {
  EyeIcon,
  DocumentDuplicateIcon,
  PhoneIcon,
  ChatIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/outline';
import { useTranslation } from '../../hooks/useTranslation';

interface Link {
  href: string;
  caption: string;
}

interface StatItem {
  id: number;
  name: string;
  stat: number;
  icon: (props: any) => React.ReactElement;
  change: string;
  changeType: 'increase' | 'decrease';
  note?: string;
  link?: Link;
}

interface StatsProps {
  totalCount: number;
  totalPostViews: number;
  totalPhoneViews: number;
  totalLineViews: number;
  totalShares: number;
  totalPins: number;
}

const Stats = ({
  totalCount,
  totalPostViews,
  totalPhoneViews,
  totalLineViews,
  totalShares,
  totalPins
}: StatsProps) => {
  const { t } = useTranslation('pages/dashboard');
  
  const stats: StatItem[] = [
    {
      id: 1,
      name: t('stats.totalPosts'),
      stat: totalCount,
      icon: DocumentDuplicateIcon,
      change: '122',
      changeType: 'increase'
    },
    {
      id: 2,
      name: t('stats.postViews'),
      stat: totalPostViews,
      icon: EyeIcon,
      change: '5.4%',
      changeType: 'increase'
    },
    {
      id: 3,
      name: t('stats.phoneViews'),
      stat: totalPhoneViews,
      icon: PhoneIcon,
      change: '3.2%',
      changeType: 'decrease',
      note: ''
    },
    {
      id: 4,
      name: t('stats.lineViews'),
      stat: totalLineViews,
      icon: ChatIcon,
      change: '3.2%',
      changeType: 'decrease',
      note: ''
    },
    {
      id: 5,
      name: t('stats.shares'),
      stat: totalShares,
      icon: ShareIcon,
      change: '3.2%',
      changeType: 'decrease',
      note: ''
    },
    {
      id: 6,
      name: t('stats.pins'),
      stat: totalPins,
      icon: BookmarkIcon,
      change: '3.2%',
      changeType: 'decrease',
      note: ''
    }
  ];

  return (
    <div>
      {/* <h3 className="text-lg font-medium leading-6 text-gray-900">
        ข้อมูลสถิติ
      </h3> */}

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>

            <dd className="ml-16 flex items-baseline pb-2 sm:pb-2">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>

              {/* <p
                className={joinClasses(
                  //   item.changeType === "increase"
                  //     ? "text-green-600"
                  //     : "text-red-600",
                  "ml-2 flex items-baseline text-sm font-semibold"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}

                <span className="sr-only">
                  {item.changeType === "increase" ? "Increased" : "Decreased"}
                  by
                </span>
              </p> */}

              {item.link && (
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a
                      href={item.link.href}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.link.caption}
                      <span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              )}
            </dd>
            <p className="text-xs text-gray-400 font-light italic mb-1">
              {item.note}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Stats;
