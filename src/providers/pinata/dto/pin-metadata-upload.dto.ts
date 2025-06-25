import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsObject, IsOptional } from 'class-validator';

export class PinMetadataUploadDto {
  @ApiProperty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    required: false,
    example: {
      title: 'Space Warrior',
      description: 'A futuristic space warrior NFT',
      attributes: [
        { trait_type: 'Background', value: 'Galaxy' },
        { trait_type: 'Weapon', value: 'Laser Gun' },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
