import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
  Type,
  UseInterceptors,
  mixin,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { throwError } from 'rxjs';

interface DisabledEndpointOptions {
  message?: string;
  httpStatus?: HttpStatus;
  hideFromSwagger?: boolean;
  markDeprecated?: boolean;
}

const DEFAULT_MESSAGE = 'This endpoint is disabled';

const createDisabledInterceptor = (
  message: string,
  status: HttpStatus,
): Type<NestInterceptor> => {
  class DisabledEndpointInterceptor implements NestInterceptor {
    private readonly logger = new Logger(DisabledEndpointInterceptor.name);

    intercept(context: ExecutionContext, _next: CallHandler) {
      const req = context.switchToHttp().getRequest();
      const path = req?.originalUrl ?? req?.url ?? 'unknown';
      this.logger.warn(`Disabled endpoint called: ${path}`);
      return throwError(
        () =>
          new HttpException(
            {
              statusCode: status,
              message,
              error: HttpStatus[status] ?? 'DisabledEndpoint',
            },
            status,
          ),
      );
    }
  }

  return mixin(DisabledEndpointInterceptor);
};

export function DisabledEndpoint(
  options: DisabledEndpointOptions = {},
): ClassDecorator & MethodDecorator {
  const message = options.message ?? DEFAULT_MESSAGE;
  const status = options.httpStatus ?? HttpStatus.GONE;

  const decorators: Array<ClassDecorator | MethodDecorator> = [
    UseInterceptors(createDisabledInterceptor(message, status)),
  ];

  if (options.hideFromSwagger) {
    decorators.push(ApiExcludeEndpoint());
  } else if (options.markDeprecated) {
    decorators.push(
      ApiOperation({
        summary: message,
        deprecated: true,
      }),
      ApiResponse({
        status,
        description: message,
      }),
    );
  }

  return applyDecorators(...decorators);
}
