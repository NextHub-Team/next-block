import { IsString } from 'class-validator';

export class DeploySleeveDto {
  @IsString()
  sleeveId: string;
}
