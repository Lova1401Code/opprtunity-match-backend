import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ContractTypeEnum {
  CDI = 'CDI',
  CDD = 'CDD',
  Freelance = 'Freelance',
  Contract = 'Contract',
}

export enum WorkModeEnum {
  Remote = 'Remote',
  Hybrid = 'Hybrid',
  'On-site' = 'On-site',
}

export enum OpportunitySourceEnum {
  LinkedIn = 'LinkedIn',
  Indeed = 'Indeed',
  Company = 'Company',
  FreelancePlatform = 'FreelancePlatform',
  Referral = 'Referral',
  Other = 'Other',
}

export enum SkillCategoryEnum {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Database = 'Database',
  DevOps = 'DevOps',
  Cloud = 'Cloud',
  Mobile = 'Mobile',
  Other = 'Other',
}

export class OpportunitySkillDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsEnum(SkillCategoryEnum)
  category?: SkillCategoryEnum;
}

export class CreateOpportunityDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  company: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsEnum(ContractTypeEnum)
  contractType: ContractTypeEnum;

  @IsString()
  @MinLength(1)
  location: string;

  @IsEnum(WorkModeEnum)
  workMode: WorkModeEnum;

  @IsEnum(OpportunitySourceEnum)
  source: OpportunitySourceEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpportunitySkillDto)
  requiredSkills: OpportunitySkillDto[];
}

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  company?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsEnum(ContractTypeEnum)
  contractType?: ContractTypeEnum;

  @IsOptional()
  @IsString()
  @MinLength(1)
  location?: string;

  @IsOptional()
  @IsEnum(WorkModeEnum)
  workMode?: WorkModeEnum;

  @IsOptional()
  @IsEnum(OpportunitySourceEnum)
  source?: OpportunitySourceEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpportunitySkillDto)
  requiredSkills?: OpportunitySkillDto[];
}