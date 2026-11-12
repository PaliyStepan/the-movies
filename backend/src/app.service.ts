import { Injectable } from '@nestjs/common';
import type { TTest } from '@the-movies/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!' as TTest;
  }
}
