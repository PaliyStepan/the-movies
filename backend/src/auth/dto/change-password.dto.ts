import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @Length(6, 100)
  currentPassword: string;

  @ApiProperty({ example: 'newPassword456' })
  @IsString()
  @Length(6, 100)
  newPassword: string;
}
