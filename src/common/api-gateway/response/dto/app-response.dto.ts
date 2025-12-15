import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard application response envelope used across providers.
 * The StandardResponseInterceptor formats handler returns into this shape.
 */
export class AppResponseDto<T = unknown> {
  @ApiProperty({ example: 200 })
  status!: number;

  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({
    example: 'OK',
    nullable: true,
    description: 'Human-friendly message for the response status',
  })
  message!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Error payload when success is false',
    type: Object,
  })
  error!: any | null;

  @ApiProperty({
    nullable: true,
    description: 'Response payload specific to the endpoint',
  })
  data!: T | null;

  @ApiProperty({ example: false })
  hasNextPage!: boolean;
}
