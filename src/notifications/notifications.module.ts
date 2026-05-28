import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsAdminController } from './notifications-admin.controller';
import { NotificationsAdminQueueService } from './notifications-admin-queue.service';
import { InternalNotificationsController } from './internal-notifications.controller';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsService } from './notifications.service';
import { InternalNotificationsGuard } from './guards/internal-notifications.guard';

@Module({
  imports: [AuthModule],
  controllers: [
    NotificationsController,
    InternalNotificationsController,
    NotificationsAdminController,
  ],
  providers: [
    NotificationsService,
    NotificationsAdminQueueService,
    NotificationsProcessor,
    InternalNotificationsGuard,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
