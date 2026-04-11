import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class FacebookAuthWithStateGuard extends AuthGuard('facebook') {
  private readonly logger = new Logger(FacebookAuthWithStateGuard.name);

  constructor(private readonly envService: EnvironmentService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { state, error } = request.query;

    if (error) {
      const response = context.switchToHttp().getResponse();

      if (error === 'access_denied') {
        this.logger.log(`Facebook OAuth cancelled by user`);
        response.redirect(
          `${this.envService.frontendWebUrl()}/auth/callback?error=oauth_cancelled&provider=facebook`
        );
      } else {
        this.logger.error(`Facebook OAuth error: ${error}`);
        response.redirect(
          `${this.envService.frontendWebUrl()}/auth/callback?error=oauth_failed&provider=facebook`
        );
      }
      return;
    }

    return { state };
  }
}
