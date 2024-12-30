// auth-vero.service.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import jwksRsa, { JwksClient, RsaSigningKey } from 'jwks-rsa';
import { AuthVeroLoginDto } from './dto/auth-vero-login.dto';
import { SocialInterface } from '../social/interfaces/social.interface';
import { VeroPayloadMapper } from './infrastructure/persistence/relational/mappers/vero.mapper';

@Injectable()
export class AuthVeroService {
  private jwksClient: JwksClient;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private veroMapper: VeroPayloadMapper,
  ) {
    const jwksUri =
      this.configService.get<string>('vero.jwksUri', { infer: true }) ||
      'https://gateway.veroapi.com/veritas/jwks';
    const cacheMaxAge =
      this.configService.get<number>('vero.cacheMaxAge', { infer: true }) ||
      36000; // 1 hour default

    this.jwksClient = jwksRsa({
      jwksUri,
      cache: true,
      cacheMaxAge, // Cache keys for 1 hour or configurable value
    });
  }

  private async getKey(header: {
    kid: string | null | undefined;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!header.kid) {
        reject(new UnauthorizedException('Missing "kid" in token header.'));
        return;
      }
      this.jwksClient.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
          reject(new UnauthorizedException('Failed to retrieve signing key.'));
        } else {
          const signingKey = (key as RsaSigningKey).getPublicKey();
          resolve(signingKey);
        }
      });
    });
  }

  async verifyToken(token: string): Promise<any> {
    const getSigningKey = async (header: {
      kid: string | null | undefined;
    }): Promise<string> => {
      if (!header || !header.kid) {
        throw new UnauthorizedException('Token header is missing "kid".');
      }
      return this.getKey(header);
    };

    try {
      // Decode token header to resolve the signing key
      const decodedHeader = this.jwtService.decode(token, {
        complete: true,
      }) as { header: { kid: string } };
      if (!decodedHeader || !decodedHeader.header) {
        throw new UnauthorizedException('Invalid token header.');
      }
      const secret = await getSigningKey(decodedHeader.header);

      // Verify token using the resolved signing key
      return await this.jwtService.verifyAsync(token, {
        secret,
        algorithms: ['RS256'],
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Token has expired.');
      }
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async getProfileByToken(
    loginDto: AuthVeroLoginDto,
  ): Promise<SocialInterface> {
    const decodedToken = await this.verifyToken(loginDto.veroToken);
    return this.veroMapper.mapPayloadToSocial(decodedToken);
  }
}
