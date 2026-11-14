import { Injectable, BadGatewayException } from '@nestjs/common';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

@Injectable()
export class MoviesProxyService {
  async fetchPoster(path: string): Promise<Buffer> {
    const url = `${TMDB_IMAGE_BASE}${path}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new BadGatewayException(`TMDB returned ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      if (err instanceof BadGatewayException) throw err;
      throw new BadGatewayException('Failed to fetch poster from TMDB');
    }
  }
}
