import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Api')
    .setDescription('A desc')
    .setVersion('1.0.0.')
    // .setContact('Nirvana', 'http://localhost:3000', 'support@kurt.ru')
    .addBearerAuth()
    .build();
}
