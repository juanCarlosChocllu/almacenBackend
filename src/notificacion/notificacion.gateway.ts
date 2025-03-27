import { WebSocketGateway, SubscribeMessage, MessageBody , OnGatewayConnection, OnGatewayDisconnect, WebSocketServer} from '@nestjs/websockets';
import { NotificacionService } from './notificacion.service';
import {Server, Socket} from 'socket.io'
import { OnEvent } from '@nestjs/event-emitter';
import { NotificacionI } from './interface/notificacion';

@WebSocketGateway({
  cors:'*'
})
export class NotificacionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server:Server
  constructor(private readonly notificacionService: NotificacionService) {}
  handleConnection(client:Socket){   
    const sucursal = client.handshake.query.sucursal;
    if(sucursal){
      client.join(sucursal)
    }
    console.log('cliente conectado');
  
  }
  handleDisconnect(client: Socket) {
    console.log('cliente desconectado');
    
  }


  @OnEvent('notificaciones.create')
    notificacionDeEnvioDeTransferencia(data:NotificacionI){         
    return this.server.to(data.sucursal).emit('notificaciones', data)
    
  }


  

  


}
