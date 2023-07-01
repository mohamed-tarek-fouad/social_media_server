import { IsNotEmpty, IsString } from 'class-validator';

export class CreatepostDto {
  @IsNotEmpty()
  @IsString()
  desc: string;
}
