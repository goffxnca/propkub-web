import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentService } from '../environments/environment.service';
import axios from 'axios';

interface SendEmailOptions {
  from?: string;
  to: string;
  templateId: any;
  templateData: Record<string, any>;
}

@Injectable()
export class BrevoMailService {
  private readonly logger = new Logger(BrevoMailService.name);
  private readonly apiKey: string;

  constructor(private readonly envService: EnvironmentService) {
    this.apiKey = this.envService.brovoApiKey();
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    this.logger.log('Sending brevo email...');

    if (this.envService.isTest()) {
      this.logger.log('Sending email is skipped on test env');
      return;
    }

    const payload = {
      // sender: {
      //   name: 'PropKub.com',
      //   email: 'noreply@propkub.com',
      // },
      to: [{ email: options.to }],
      templateId: 6,
      // templateId: options.templateId,
      params: {
        ...options.templateData,
        titlePrefix: this.envService.isProd()
          ? ''
          : this.envService.isTest()
            ? '[TEST]'
            : '[DEV]'
      },
      headers: {
        'X-Mailin-custom': 'sent-via:nestjs'
      }
    };

    try {
      await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error: any) {
      const msg = error?.response?.data || error.message;
      this.logger.error(`Failed to send email to ${options.to}`, msg);
    }
  }
}
