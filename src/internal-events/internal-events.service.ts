import {
  // common
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateInternalEventDto } from './dto/create-internal-event.dto';
import { UpdateInternalEventDto } from './dto/update-internal-event.dto';
import { InternalEventRepository } from './infrastructure/persistence/internal-event.repository';
import { IPaginationOptions } from '../utils/types/pagination-options.type';
import { InternalEvent } from './domain/internal-event';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { LoggerService } from '../common/logger/logger.service';
import { ConfigGet } from '../config/config.decorator';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class InternalEventsService {
  @ConfigGet('internalEvents.serviceName', {
    inferEnvVar: true,
    defaultValue: 'api',
  })
  private readonly serviceName!: string;

  @ConfigGet('internalEvents.enable', {
    inferEnvVar: true,
    defaultValue: true,
  })
  private readonly enable!: boolean;

  constructor(
    // Dependencies here
    private readonly internalEventRepository: InternalEventRepository,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    // Touch configService so ConfigGet decorator can access it without lint warnings.
    void this.configService;
  }

  async create(createInternalEventDto: CreateInternalEventDto) {
    // Do not remove comment below.
    // <creating-property />
    this.loggerService.debug(
      `Creating internal event type=${createInternalEventDto.eventType} service=${this.serviceName} enabled=${this.enable}`,
      InternalEventsService.name,
    );

    const created = await this.internalEventRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      payload: createInternalEventDto.payload ?? {},

      eventType: createInternalEventDto.eventType,
    });

    this.loggerService.log(
      `Created internal event id=${created.id} type=${created.eventType}`,
      InternalEventsService.name,
    );

    return created;
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.internalEventRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: InternalEvent['id']) {
    return this.internalEventRepository.findById(id);
  }

  findByIds(ids: InternalEvent['id'][]) {
    return this.internalEventRepository.findByIds(ids);
  }

  async update(
    id: InternalEvent['id'],

    updateInternalEventDto: UpdateInternalEventDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    this.loggerService.debug(
      `Updating internal event id=${id}`,
      InternalEventsService.name,
    );

    const updated = await this.internalEventRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      payload: updateInternalEventDto.payload as DeepPartial<
        InternalEvent['payload']
      >,

      eventType: updateInternalEventDto.eventType,
    });

    if (updated) {
      this.loggerService.log(
        `Updated internal event id=${id} type=${updated.eventType}`,
        InternalEventsService.name,
      );
    } else {
      this.loggerService.warn(
        `Internal event id=${id} not found for update`,
        InternalEventsService.name,
      );
    }

    return updated;
  }

  remove(id: InternalEvent['id']) {
    this.loggerService.warn(
      `Removing internal event id=${id}`,
      InternalEventsService.name,
    );
    return this.internalEventRepository.remove(id);
  }
}
