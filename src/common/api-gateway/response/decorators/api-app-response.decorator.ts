import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppResponseDto } from '../dto/app-response.dto';

interface ApiAppResponseOptions {
  description?: string;
  isArray?: boolean;
  nullableData?: boolean;
}

/**
 * Swagger helper to document the standard app response envelope:
 * { status, success, message, error, data, hasNextPage }
 */
export function ApiAppOkResponse<Model extends Type<unknown>>(
  model: Model,
  options?: ApiAppResponseOptions,
) {
  const isArray = options?.isArray ?? false;
  const nullableData = options?.nullableData ?? false;

  return applyDecorators(
    ApiExtraModels(AppResponseDto, model),
    ApiOkResponse({
      description: options?.description ?? 'Successful response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponseDto) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                    nullable: nullableData,
                  }
                : { $ref: getSchemaPath(model), nullable: nullableData },
            },
          },
        ],
      },
    }),
  );
}

export function ApiAppCreatedResponse<Model extends Type<unknown>>(
  model: Model,
  options?: ApiAppResponseOptions,
) {
  const isArray = options?.isArray ?? false;
  const nullableData = options?.nullableData ?? false;

  return applyDecorators(
    ApiExtraModels(AppResponseDto, model),
    ApiCreatedResponse({
      description: options?.description ?? 'Resource created',
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponseDto) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                    nullable: nullableData,
                  }
                : { $ref: getSchemaPath(model), nullable: nullableData },
            },
          },
        ],
      },
    }),
  );
}
