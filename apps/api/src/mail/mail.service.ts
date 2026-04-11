import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { NO_REPLY_EMAIL } from '../common/constants';
import { EnvironmentService } from '../environments/environment.service';

interface SendEmailOptions {
  to: string;
  templateId: string;
  templateData: Record<string, any>;
  from?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly envService: EnvironmentService) {
    sgMail.setApiKey(this.envService.sendGridApiKey());
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    this.logger.log('Sending email...');

    if (this.envService.isTest()) {
      this.logger.log('Sending email is skipped on test env');
      return;
    }

    const email = {
      to: options.to,
      from: options.from || NO_REPLY_EMAIL,
      templateId: options.templateId,
      dynamic_template_data: {
        ...options.templateData,
        titlePrefix: this.envService.isProd()
          ? ''
          : this.envService.isTest()
            ? '[TEST]'
            : '[DEV]'
      },
      bcc: this.envService.emailBCC()
    };

    try {
      await sgMail.send(email);
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      const errorMessage = `Failed to send email to ${options.to} - ${error.message}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
