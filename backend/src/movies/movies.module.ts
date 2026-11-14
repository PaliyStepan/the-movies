import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MoviesController } from './movies.controller.js';
import { MoviesService } from './movies.service.js';
import { MoviesProxyController } from './movies-proxy.controller.js';
import { MoviesProxyService } from './movies-proxy.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [MoviesProxyController, MoviesController],
  providers: [MoviesService, MoviesProxyService],
})
export class MoviesModule {}
