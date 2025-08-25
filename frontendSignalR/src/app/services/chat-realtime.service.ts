import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { NewMessage } from '../model/new-message';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatRealtimeService {
  private connection?: signalR.HubConnection;
  public conversation: NewMessage[] = [{
    message: 'Bienvenido',
    userName: 'Sistema'
  }]

  connect() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.chatHub, {
        withCredentials: sessionStorage.getItem('token') != null,
        accessTokenFactory: () => {
          let token = sessionStorage.getItem('token');
          return token ?? '';
        },
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.connection
      .start().then(() => console.log('Connected to SignalR hub'))
      .catch(err => console.error('Error connecting to SignalR hub:', err));

    this.connection.on("NewUser", message => this.newUser(message));
    this.connection.on("NewMessage", message => this.newMessage(message));
    this.connection.on("LeftUser", message => this.leftUser(message));
  }

  getMessage() {
    return this.conversation;
  }

  async join(groupName: string, userName: string) {
    return this.connection?.invoke('JoinGroup', groupName, userName);

  }

  async sendMessage(newMessage: NewMessage) {
    return this.connection?.invoke('SendMessage', newMessage);
  }

  async leave(groupName: string, userName: string) {
    return this.connection?.invoke('LeaveGroup', groupName, userName);
  }


  private newUser(message: string) {
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  private newMessage(message: NewMessage) {
    this.conversation.push(message);
  }

  private leftUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }
}
