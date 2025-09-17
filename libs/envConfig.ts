const envConfig = {
  isDev: () => {
    return process.env.NODE_ENV === 'development';
  },
  isProd: () => {
    return process.env.NODE_ENV === 'production';
  },
  apiUrl: () => {
    const value = process.env.NEXT_PUBLIC_API_URL;
    if (!value) throw new Error('NEXT_PUBLIC_API_URL is required');
    return value;
  },
  apiKey: () => {
    const value = process.env.API_KEY;
    if (!value) throw new Error('API_KEY is required');
    return value;
  },
  sentryDSN: () => {
    const value = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!value) throw new Error('NEXT_PUBLIC_SENTRY_DSN is required');
    return value;
  },
  mapKey: () => {
    const value = process.env.NEXT_PUBLIC_GGMAP_API_KEY;

    if (!value && envConfig.isProd()) {
      throw new Error('NEXT_PUBLIC_GGMAP_API_KEY is required in production');
    }

    return value || null;
  }
};

export { envConfig };
