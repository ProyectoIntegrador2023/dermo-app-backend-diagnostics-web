import {
  IsBoolean,
  IsNumberString,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class DiagnosticDto {
  @IsUUID()
  public readonly injuryId: string;

  @IsNumberString()
  public readonly medicId: number;

  @IsString()
  @MinLength(5)
  public readonly condition: string;

  @IsString()
  @MinLength(5)
  public readonly level: string;

  @IsBoolean()
  public readonly requeresTreatment: boolean;

  @IsString()
  @MinLength(2)
  public readonly treatmentTerm: string;

  @IsString()
  @MinLength(5)
  public readonly medicines: string;

  @IsString()
  @MinLength(2)
  public readonly treatmentControl: string;

  @IsString()
  @MinLength(5)
  public readonly recommendations: string;
}
