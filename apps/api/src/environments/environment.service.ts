import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  isDev(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  isTest(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'test';
  }

  isProd(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  apiDomain(): string {
    const apiDomain = this.configService.get<string>('API_DOMAIN');
    if (!apiDomain) {
      throw new Error('API_DOMAIN env is missing.');
    }
    return apiDomain;
  }

  frontendWebUrl(): string {
    const frontendWebUrl = this.configService.get<string>('FRONTEND_WEB_URL');
    if (!frontendWebUrl) {
      throw new Error('FRONTEND_WEB_URL env is missing.');
    }
    return frontendWebUrl;
  }

  sendGridApiKey(): string {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY env is missing.');
    }
    return apiKey;
  }

  brovoApiKey(): string {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    if (!apiKey) {
      throw new Error('BREVO_API_KEY env is missing.');
    }
    return apiKey;
  }

  // API Key used to verify that a request is called from NextJS Server when processing SSR/SSG/ISG
  apiKeyForNextJSServer(): string {
    const apiKey = this.configService.get<string>('API_KEY_FOR_NEXTJS_SERVER');
    if (!apiKey) {
      throw new Error('API_KEY_FOR_NEXTJS_SERVER env is missing.');
    }
    return apiKey;
  }

  emailBCC(): string {
    const emailBCC = this.configService.get<string>('EMAIL_BCC');
    if (!emailBCC) {
      throw new Error('EMAIL_BCC env is missing.');
    }
    return emailBCC;
  }

  sentryDSN(): string {
    const sentryDSN = this.configService.get<string>('SENTRY_DSN');
    if (!sentryDSN) {
      throw new Error('SENTRY_DSN env is missing.');
    }
    return sentryDSN;
  }
}
