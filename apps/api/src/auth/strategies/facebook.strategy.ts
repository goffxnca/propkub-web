import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID') || '',
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') || '',
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: ['email']
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: Error | null, user?: any) => void
  ): any {
    const { id, emails, name, photos } = profile;

    const user = {
      facebookId: id,
      email: emails?.[0]?.value,
      name: name?.givenName + ' ' + name?.familyName,
      profileImg: photos?.[0]?.value
    };
    done(null, user);
  }
}
