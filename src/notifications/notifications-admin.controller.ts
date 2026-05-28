import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { CurrentAdminUser } from '../auth/decorators/current-admin-user.decorator';
import { RequireAdminPermissions } from '../auth/decorators/require-admin-permissions.decorator';
import {
  AuthenticatedAdminRequestUser,
  RequestWithAdminUser,
} from '../auth/interfaces/admin-authenticated-request.interface';
import { AdminQueueQueryDto } from './dto/admin-queue-query.dto';
import { ListAdminNotificationMetricsQueryDto } from './dto/list-admin-notification-metrics-query.dto';
import { ListAdminNotificationsQueryDto } from './dto/list-admin-notifications-query.dto';
import { PublishNotificationDto } from './dto/publish-notification.dto';
import { NotificationsAdminQueueService } from './notifications-admin-queue.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications/admin')
@UseGuards(AdminJwtAuthGuard, AdminPermissionsGuard)
export class NotificationsAdminController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsAdminQueueService: NotificationsAdminQueueService,
  ) {}

  @Get('metrics')
  @RequireAdminPermissions('stats.read')
  getMetrics(@Query() query: ListAdminNotificationMetricsQueryDto) {
    return this.notificationsService.getAdminMetrics(query);
  }

  @Get('workers/queue')
  @RequireAdminPermissions('workers.read')
  getWorkerQueue(@Query() query: AdminQueueQueryDto) {
    return this.notificationsAdminQueueService.getSnapshot(query);
  }

  @Post('workers/queue/pause')
  @RequireAdminPermissions('workers.manage')
  pauseWorkerQueue() {
    return this.notificationsAdminQueueService.pause();
  }

  @Post('workers/queue/resume')
  @RequireAdminPermissions('workers.manage')
  resumeWorkerQueue() {
    return this.notificationsAdminQueueService.resume();
  }

  @Post('workers/queue/jobs/:jobId/retry')
  @RequireAdminPermissions('workers.manage')
  retryWorkerJob(@Param('jobId') jobId: string) {
    return this.notificationsAdminQueueService.retry(jobId);
  }

  @Get()
  @RequireAdminPermissions('notifications.read')
  listNotifications(@Query() query: ListAdminNotificationsQueryDto) {
    return this.notificationsService.listAdminNotifications(query);
  }

  @Get('devices')
  @RequireAdminPermissions('notifications.read')
  listDevices(@Query('userId') userId?: string) {
    return this.notificationsService.listAdminDevices(userId);
  }

  @Post('publish')
  @RequireAdminPermissions('notifications.write')
  publish(
    @CurrentAdminUser() adminUser: AuthenticatedAdminRequestUser,
    @Req() request: RequestWithAdminUser,
    @Body() dto: PublishNotificationDto,
  ) {
    return this.notificationsService.publish(
      {
        ...dto,
        sourceService: dto.sourceService || 'admin',
        sourceEvent: dto.sourceEvent || `admin.${adminUser.adminUserId}`,
      },
      {
        authorizationHeader: request.header('authorization') || undefined,
      },
    );
  }

  @Post(':notificationId/retry')
  @RequireAdminPermissions('notifications.write')
  retry(@Param('notificationId') notificationId: string) {
    return this.notificationsService.retryNotification(notificationId);
  }
}
