import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionGateway } from './notificacion.gateway';

@Module({
  providers: [NotificacionGateway, NotificacionService],
})
export class NotificacionModule {}
