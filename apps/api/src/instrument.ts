import * as Sentry from '@sentry/nestjs';

export function initializeSentry(dsn: string) {
  Sentry.init({
    dsn,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true
  });
}
