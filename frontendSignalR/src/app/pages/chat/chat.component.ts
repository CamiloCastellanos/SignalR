import { Component } from '@angular/core';
import { ChatRealtimeService } from '../../services/chat-realtime.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { } from '@angular/common/http';
import { NewMessage } from '../../model/new-message';


@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  userName: string = '';
  groupName: string = '';
  messageToSend: string = '';
  joined: boolean = false;

  constructor(private chatRealtimeService: ChatRealtimeService) {
    this.chatRealtimeService.connect();
  }

  join() {
    if (this.groupName.trim() != '' && this.userName.trim() != '') {
      this.chatRealtimeService.join(this.groupName, this.userName)?.then(_ => {
        this.joined = true;
      });
    }
  }

  sendMessage() {
    const newMessage: NewMessage = {
      message: this.messageToSend,
      userName: this.userName,
      groupName: this.groupName
    };
    this.chatRealtimeService.sendMessage(newMessage)?.then(_ => this.messageToSend = '');
  }

  leave() {
    this.chatRealtimeService.leave(this.groupName, this.userName)?.then(_ => this.joined = false);
  }

  getMessage() {
    return this.chatRealtimeService.getMessage();
  }

}

