import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Readable } from 'stream';
import { pinata } from './config/pinata.instance';
import { PinFileDto } from './dto/pin-file.dto';
import { PinJsonDto } from './dto/pin-json.dto';
import { v4 as uuidv4 } from 'uuid';
import { PinMetadataUploadDto } from './dto/pin-metadata-upload.dto';
import axios from 'axios';

@Injectable()
export class PinataService {
  //Uploade Pinata File
  async pinFileToIPFS(file: Express.Multer.File, dto?: PinFileDto) {
    try {
      const stream = Readable.from(file.buffer);
      const options = {
        pinataMetadata: {
          name: dto?.filename ?? uuidv4(),
        },
      };

      const result = await pinata.pinFileToIPFS(stream, options);
      return {
        ipfsHash: result.IpfsHash,
        name: result.PinSize,
        timestamp: result.Timestamp,
      };
    } catch {
      throw new InternalServerErrorException('Failed to upload file to Pinata');
    }
  }

  //Uplade json
  async pinJsonToIPFS(json: PinJsonDto) {
    try {
      const result = await pinata.pinJSONToIPFS(json);
      return {
        ipfsHash: result.IpfsHash,
        timestamp: result.Timestamp,
      };
    } catch {
      throw new InternalServerErrorException('Failed to upload JSON to Pinata');
    }
  }

  async pinImageAndMetadataFromUrl(dto: PinMetadataUploadDto) {
    try {
      // 1. Download image
      const response = await axios.get(dto.imageUrl, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(response.data, 'binary');

      // 2. Upload image to Pinata
      const stream = Readable.from(buffer);
      const imageOptions = {
        pinataMetadata: {
          name: dto.metadata?.title ?? uuidv4(),
        },
      };
      const fileUploadResult = await pinata.pinFileToIPFS(stream, imageOptions);

      // 3. Construct metadata JSON
      const metadata = {
        name: dto.metadata?.title ?? 'Untitled NFT',
        description: dto.metadata?.description ?? '',
        image: `ipfs://${fileUploadResult.IpfsHash}`,
        attributes: dto.metadata?.attributes ?? [],
      };

      // 4. Upload metadata JSON
      const jsonResult = await pinata.pinJSONToIPFS(metadata);

      return {
        imageIpfsHash: fileUploadResult.IpfsHash,
        metadataIpfsHash: jsonResult.IpfsHash,
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to upload image and metadata to Pinata',
      );
    }
  }
}
