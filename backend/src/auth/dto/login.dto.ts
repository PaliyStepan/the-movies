import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    description: 'Почтовый адрес',
    example: 'example@example.ru',
  })
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @MaxLength(50, { message: 'Длина email должна быть не больше 50 символов' })
  email: string;

  @ApiProperty({
    description: 'Пароль',
    example: '1фы2112125',
    minLength: 6,
    maxLength: 20,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @Length(6, 20, {
    message: 'Длина пароля должна быть от 6 до 20 символов',
  })
  password: string;
}
