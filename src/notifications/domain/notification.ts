import { Device } from '../../devices/domain/device';
import { ApiProperty } from '@nestjs/swagger';

export class Notification {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  scheduledAt?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  sentAt?: string | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
  })
  isRead?: boolean | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  status?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  priority?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  type: string;

  @ApiProperty({
    type: () => Device,
    nullable: false,
  })
  device: Device;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  message: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
