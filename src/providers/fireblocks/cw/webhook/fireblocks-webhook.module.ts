import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../base/fireblocks-core.module';
import { WebhookSignatureVerifier } from './webhook-signature-verifier';
import { WebhookEventDedupeStore } from './webhook-event-dedupe.store';
import { WebhookEventRouter } from './webhook-event-router';
import { WebhookAdminService } from './webhook-admin.service';
import { WebhookProcessingQueue } from './webhook-processing.queue';

@Module({
  imports: [FireblocksCoreModule],
  providers: [
    WebhookSignatureVerifier,
    WebhookEventDedupeStore,
    WebhookEventRouter,
    WebhookAdminService,
    WebhookProcessingQueue,
  ],
  exports: [
    WebhookSignatureVerifier,
    WebhookEventDedupeStore,
    WebhookEventRouter,
    WebhookAdminService,
    WebhookProcessingQueue,
  ],
})
export class FireblocksWebhookModule {}
