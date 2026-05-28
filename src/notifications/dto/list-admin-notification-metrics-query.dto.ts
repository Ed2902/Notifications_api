import { IsDateString, IsOptional } from 'class-validator';

export class ListAdminNotificationMetricsQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

