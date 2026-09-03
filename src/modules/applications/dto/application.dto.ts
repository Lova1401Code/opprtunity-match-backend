import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ApplicationStatusEnum {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
}

export class CreateApplicationDto {
  @IsString()
  opportunityId: string;

  @IsOptional()
  @IsEnum(ApplicationStatusEnum)
  status?: ApplicationStatusEnum;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatusEnum)
  status?: ApplicationStatusEnum;

  @IsOptional()
  @IsString()
  note?: string;
}