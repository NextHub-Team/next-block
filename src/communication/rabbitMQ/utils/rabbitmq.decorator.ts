import { EventEmitter2 } from '@nestjs/event-emitter';
import { RmqContext } from '@nestjs/microservices';
import { RmqEventPayload } from '../types/rabbitmq-interface.type';

export function RMQMessageEvent(eventName: string): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const payload = args[0];
      const context: RmqContext = args[1];

      const result = await originalMethod.apply(this, args);

      if (this.eventEmitter instanceof EventEmitter2) {
        const eventData: RmqEventPayload = { payload, context };
        this.eventEmitter.emit(eventName, eventData);
      } else {
        throw new Error(
          `[RMQMessageEvent] eventEmitter not found on ${this.constructor.name}`,
        );
      }

      return result;
    };

    return descriptor;
  };
}
