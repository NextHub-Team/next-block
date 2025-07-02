import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RMQExchangeDto, RMQMessageDto } from '../dto/message.dto';
import { ProducerService } from './producer.service';

@ApiTags('RabbitMQ')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'rabbitmq',
  version: '1',
})
export class ProducerController {
  private readonly logger = new Logger(ProducerController.name);

  constructor(private readonly producerService: ProducerService) {}

  @Get('exchanges')
  @ApiOperation({ summary: 'Get list of allowed RabbitMQ exchanges' })
  @ApiOkResponse({
    description: 'List of allowed exchanges',
    schema: {
      example: {
        exchanges: ['exchange-a', 'exchange-b'],
      },
    },
  })
  getExchanges() {
    const exchanges = this.producerService.getExchanges();
    return { exchanges };
  }

  @Post('message/:exchange')
  @ApiOperation({ summary: 'Send a message to a specific exchange' })
  @ApiParam({ name: 'exchange', description: 'Target exchange name' })
  @ApiOkResponse({
    description: 'Message successfully sent',
    schema: {
      example: {
        success: true,
        message: "Message sent to 'exchange-a'",
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Exchange is not registered or invalid',
    schema: {
      example: {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          exchange: 'Exchange is not registered',
        },
      },
    },
  })
  sendMessage(
    @Param() params: RMQExchangeDto,
    @Body() rmqMessageDto: RMQMessageDto,
  ) {
    const success = this.producerService.sendMessage(params, rmqMessageDto);

    if (!success) {
      return {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        errors: {
          exchange: 'Exchange is not registered',
        },
      };
    }

    return {
      status: HttpStatus.OK,
      success: true,
      message: `Message sent to '${params.exchange}'`,
    };
  }
}
