import { Observable } from '@nativescript/core';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class ChatViewModel extends Observable {
  private messageService: MessageService;
  private authService: AuthService;
  public conversations: any[] = [];
  public isLoading: boolean = false;

  constructor() {
    super();
    this.messageService = MessageService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadConversations();
  }

  async loadConversations() {
    this.set('isLoading', true);
    try {
      const messages = await this.messageService.getMessages();
      const conversationMap = new Map();
      
      messages.forEach(message => {
        const otherUser = message.sender_id === this.authService.currentUser.id 
          ? message.recipient_username 
          : message.sender.username;
        
        if (!conversationMap.has(otherUser)) {
          conversationMap.set(otherUser, {
            username: otherUser,
            lastMessage: message.content,
            lastMessageTime: new Date(message.created_at).toLocaleTimeString()
          });
        }
      });

      this.set('conversations', Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      this.set('isLoading', false);
    }
  }

  onConversationTap(args) {
    const conversation = this.conversations[args.index];
    Frame.topmost().navigate({
      moduleName: 'views/chat/conversation-page',
      context: { username: conversation.username }
    });
  }

  onNewChat() {
    Frame.topmost().navigate('views/chat/new-chat-page');
  }

  async onLogout() {
    try {
      await this.authService.signOut();
      Frame.topmost().navigate({
        moduleName: 'views/login/login-page',
        clearHistory: true
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}