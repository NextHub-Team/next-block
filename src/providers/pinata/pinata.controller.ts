import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PinataService } from './pinata.service';
import { PinFileDto } from './dto/pin-file.dto';
import { PinJsonDto } from './dto/pin-json.dto';
import { ApiTags, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PinMetadataUploadDto } from './dto/pin-metadata-upload.dto';

@ApiTags('Pinata')
@Controller('pinata')
export class PinataController {
  constructor(private readonly pinataService: PinataService) {}

  @Post('file')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload file to Pinata IPFS' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        filename: {
          type: 'string',
          example: 'example.png',
        },
      },
    },
  })
  async uploadFileToIPFS(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PinFileDto,
  ) {
    return this.pinataService.pinFileToIPFS(file, dto);
  }

  @Post('json')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload JSON to Pinata IPFS' })
  @ApiBody({ type: PinJsonDto })
  async uploadJsonToIPFS(@Body() dto: PinJsonDto) {
    return this.pinataService.pinJsonToIPFS(dto);
  }

  @Post('from-url')
  @ApiBody({ type: PinMetadataUploadDto })
  async uploadFromImageUrl(@Body() dto: PinMetadataUploadDto) {
    return this.pinataService.pinImageAndMetadataFromUrl(dto);
  }
}
