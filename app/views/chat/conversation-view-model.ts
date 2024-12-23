import { Observable } from '@nativescript/core';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';

export class ConversationViewModel extends Observable {
  private messageService: MessageService;
  private authService: AuthService;
  public messages: any[] = [];
  public messageText: string = '';
  public recipientUsername: string;

  constructor(recipientUsername: string) {
    super();
    this.messageService = MessageService.getInstance();
    this.authService = AuthService.getInstance();
    this.recipientUsername = recipientUsername;
    this.loadMessages();
  }

  async loadMessages() {
    try {
      const messages = await this.messageService.getMessages();
      const conversationMessages = messages
        .filter(msg => 
          msg.recipient_username === this.recipientUsername || 
          msg.sender_username === this.recipientUsername
        )
        .map(msg => ({
          content: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString(),
          isOwn: msg.sender_id === this.authService.currentUser.id
        }));

      this.set('messages', conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async onSendMessage() {
    if (!this.messageText.trim()) return;

    try {
      await this.messageService.sendMessage(this.recipientUsername, this.messageText);
      this.set('messageText', '');
      await this.loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}