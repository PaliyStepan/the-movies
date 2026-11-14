import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { MoviesProxyService } from './movies-proxy.service.js';

@ApiTags('movies')
@Controller({ path: 'poster', version: '1' })
export class MoviesProxyController {
  constructor(private readonly proxyService: MoviesProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Прокси для постеров TMDB' })
  async proxyPoster(@Query('path') path: string, @Res() res: Response) {
    if (!path || !path.startsWith('/')) {
      throw new BadRequestException('Invalid poster path');
    }

    const imageBuffer = await this.proxyService.fetchPoster(path);

    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
    });
    res.send(imageBuffer);
  }
}
