import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { User, UserDocument } from '../users/users.schema';
import { MailService } from './mail.service';
import {
  EMAIL_AUTH_UPGRADE,
  EMAIL_POST_SYSTEM_IS_UP_AGAIN,
  EMAIL_PRE_AUTH_UPGRADE,
  NO_REPLY_EMAIL
} from '../common/constants';

@Injectable()
export class MailCronService {
  private readonly logger = new Logger(MailCronService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService
  ) {}

  // @Cron(CronExpression.EVERY_6_MONTHS)
  async sendPreAuthUpgradeEmail() {
    this.logger.log(`sendPreAuthUpgradeEmail()...`);

    const user = await this.userModel
      .findOne({ ___f_pre_auth_mail_sent: false })
      .exec();

    if (!user) {
      this.logger.warn(
        'No user found with ___f_pre_auth_mail_sent:false -> Exit'
      );
      return;
    }

    await this.mailService.sendEmail({
      to: user.email,
      from: NO_REPLY_EMAIL,
      templateId: EMAIL_PRE_AUTH_UPGRADE,
      templateData: {
        name: user.name || user.email
      }
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      ___f_pre_auth_mail_sent: true
    });

    this.logger.log(
      `Send email EMAIL_PRE_AUTH_UPGRADE to user ${user.email}(cid:${user.cid}) success`
    );
  }

  // @Cron(CronExpression.EVERY_6_MONTHS)
  async sendAuthUpgradeEmail() {
    this.logger.log(`sendAuthUpgradeEmail()...`);

    const user = await this.userModel
      .findOne({ ___f_auth_mail_sent: false })
      .select('+temp_p')
      .exec();

    if (!user) {
      this.logger.warn('No user found with ___f_auth_mail_sent:false -> Exit');
      return;
    }

    if (!user.temp_p) {
      this.logger.warn(`temp_p not found for user ${user.email} -> Exit`);
      return;
    }

    await this.mailService.sendEmail({
      to: user.email,
      from: NO_REPLY_EMAIL,
      templateId: EMAIL_AUTH_UPGRADE,
      templateData: {
        name: user.name || user.email,
        email: user.email,
        pwd: user.temp_p
      }
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      ___f_auth_mail_sent: true
    });

    this.logger.log(
      `Send email EMAIL_AUTH_UPGRADE to user ${user.email}(cid:${user.cid}) success`
    );
  }

  // @Cron(CronExpression.EVERY_6_MONTHS)
  async send_EMAIL_POST_SYSTEM_IS_UP_AGAIN() {
    this.logger.log(`send_EMAIL_POST_SYSTEM_IS_UP_AGAIN()...`);

    const user = await this.userModel
      .findOne({ email: 'user@mail.com' })
      .exec();

    if (!user) {
      this.logger.warn('No user found with the provided condition -> Exit');
      return;
    }

    await this.mailService.sendEmail({
      to: user.email,
      from: NO_REPLY_EMAIL,
      templateId: EMAIL_POST_SYSTEM_IS_UP_AGAIN,
      templateData: {
        name: user.name || user.email
      }
    });

    this.logger.log(
      `Send email EMAIL_PRE_AUTH_UPGRADE to user ${user.email}(cid:${user.cid}) success`
    );
  }
}
