import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageDto } from './message.dto';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  usersAmount: number = 0;

  afterInit() {
    this.logger.log(`Initialize server`);
  }

  async handleConnection(client: Socket) {
    this.usersAmount ++;
    this.wss.emit('allUsers', this.usersAmount);
    this.logger.log(`Client Connect: ${client.id}, All users: ${this.usersAmount}`);
  }

  async handleDisconnect(client: Socket) {
    this.usersAmount --;
    this.wss.emit('allUsers', this.usersAmount);
    this.logger.log(`Client Disconnect: ${client.id}, All users: ${this.usersAmount}`);
  }

  @SubscribeMessage('messageToServer')
  async handleMessage(client: Socket, message: MessageDto ): Promise<void> {
    this.wss.emit('messageToClient', message);
  }
}
