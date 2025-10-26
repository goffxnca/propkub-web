import { useRouter } from 'next/router';

type Announcement = {
  enabled: boolean;
  type: string;
  message: string;
};

type AnnouncementsData = {
  [key: string]: Announcement;
};

// Import announcement translations
import thAnnouncements from '../public/locales/th/announcements.json';
import enAnnouncements from '../public/locales/en/announcements.json';

const announcements: { th: AnnouncementsData; en: AnnouncementsData } = {
  th: thAnnouncements,
  en: enAnnouncements
};

export const useAnnouncements = () => {
  const router = useRouter();
  const locale = router.locale || 'th';

  const getActiveAnnouncements = (): Array<{ key: string; message: string }> => {
    const localeAnnouncements = announcements[locale as 'th' | 'en'];

    return Object.entries(localeAnnouncements)
      .filter(([_, announcement]) => announcement.enabled)
      .map(([key, announcement]) => ({
        key,
        message: announcement.message
      }));
  };

  const getFirstActiveAnnouncement = (): string | null => {
    const active = getActiveAnnouncements();
    return active.length > 0 ? active[0].message : null;
  };

  return {
    getActiveAnnouncements,
    getFirstActiveAnnouncement
  };
};

