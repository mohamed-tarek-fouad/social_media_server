import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatepostDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  desc: string;
}
