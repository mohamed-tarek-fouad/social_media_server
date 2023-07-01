/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';
const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};
export class UpdateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  @IsOptional()
  firstname: string;

  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  lastname: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;

  @IsOptional()
  address: string;

  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  info: string;
}
