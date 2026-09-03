import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum ExperienceLevelEnum {
  Junior = 'Junior',
  Mid = 'Mid',
  Senior = 'Senior',
  Lead = 'Lead',
}

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

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(ExperienceLevelEnum)
  experienceLevel?: ExperienceLevelEnum;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(ContractTypeEnum, { each: true })
  preferredContract?: ContractTypeEnum[];

  @IsOptional()
  @IsArray()
  @IsEnum(WorkModeEnum, { each: true })
  preferredWorkMode?: WorkModeEnum[];

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;
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

export enum SkillLevelEnum {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export class SkillDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEnum(SkillCategoryEnum)
  category: SkillCategoryEnum;

  @IsEnum(SkillLevelEnum)
  level: SkillLevelEnum;
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(SkillCategoryEnum)
  category?: SkillCategoryEnum;

  @IsOptional()
  @IsEnum(SkillLevelEnum)
  level?: SkillLevelEnum;
}