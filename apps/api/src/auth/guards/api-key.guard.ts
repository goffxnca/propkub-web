import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly environmentService: EnvironmentService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.environmentService.apiKeyForNextJSServer()) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
